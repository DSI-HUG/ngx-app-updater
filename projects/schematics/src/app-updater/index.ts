import { tags } from '@angular-devkit/core';
import { chain, noop, Rule, Tree } from '@angular-devkit/schematics';
import { JSONFile } from '@schematics/angular/utility/json-file';

import { addAngularJsonAssets, addImportToNgModule, ensureIsAngularProject, getDefaultProjectName } from '../utility/angular';
import { addImportToFile, deployFiles, modifyJson } from '../utility/file';
import { addPackageJsonDependencies, packageInstallTask } from '../utility/package-json';
import { schematic } from '../utility/rules';

export default (): Rule =>
    (tree: Tree): Rule => {
        const architectPath = ['projects', getDefaultProjectName(tree), 'architect'];
        const pkgJson = new JSONFile(tree, 'package.json');

        return schematic('app-updater', [
            ensureIsAngularProject(),

            // Add dependencies
            chain([
                addPackageJsonDependencies([{
                    key: '@angular/service-worker',
                    value: pkgJson.get(['dependencies', '@angular/core']) as string
                }]),
                packageInstallTask()
            ]),

            // Deploy files
            deployFiles({
                appName: pkgJson.get(['appName']) || getDefaultProjectName(tree)
            }),

            // Deploy icons
            // TODO: dl from cdn 72, 96, 128, 144, 152, 192, 384, 512

            // Modify index.html
            (): void => {
                let indexHtml = tree.read('src/index.html')?.toString('utf-8') || '';
                let needsOverwrite = false;
                // Add manifest link
                if (!indexHtml.includes('<link rel="manifest"')) {
                    const manifest = '<link rel="manifest" href="manifest.webmanifest">';
                    indexHtml = indexHtml.replace('</head>', `  ${manifest}\n</head>`);
                    needsOverwrite = true;
                }
                // Add theme-color metadata
                if (!indexHtml.includes('<meta name="theme-color"')) {
                    const themeColor = '<meta name="theme-color" content="#fffff">';
                    indexHtml = indexHtml.replace('</head>', `  ${themeColor}\n</head>`);
                    needsOverwrite = true;
                }
                // Add noscript tag
                if (!indexHtml.includes('<noscript>')) {
                    const noscript = '<noscript>Please enable JavaScript to continue using this application.</noscript>';
                    indexHtml = indexHtml.replace('</body>', `  ${noscript}\n</body>`);
                    needsOverwrite = true;
                }
                if (needsOverwrite) {
                    tree.overwrite('src/index.html', indexHtml);
                }
            },

            // Modify angular.json
            modifyJson('angular.json', [...architectPath, 'build', 'options', 'serviceWorker'], true),
            modifyJson('angular.json', [...architectPath, 'build', 'options', 'ngswConfigPath'], 'ngsw-config.json'),
            addAngularJsonAssets('src/manifest.webmanifest'),

            // Add import to app.module
            addImportToFile(
                'src/app/app.module.ts',
                'environment',
                '../environments/environment'
            ),
            addImportToNgModule(
                'src/app/app.module.ts',
                tags.stripIndent`
                    AppUpdaterModule.forRoot({
                        enabled: environment.production
                    })
                `,
                '@hug/ngx-app-updater'
            ),
            (): Rule => {
                const appModule = tree.read('src/app/app.module.ts')?.toString('utf-8') || '';
                if (!appModule.includes('NoopAnimationsModule')) {
                    return addImportToNgModule(
                        'src/app/app.module.ts',
                        'BrowserAnimationsModule',
                        '@angular/platform-browser/animations'
                    );
                }
                return noop();
            }
        ]);
    };
