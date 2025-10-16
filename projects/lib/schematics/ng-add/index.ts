import { tags } from '@angular-devkit/core';
import { chain, type Rule, type Tree } from '@angular-devkit/schematics';
import {
    addImportToFile, addImportToNgModule, addProviderToBootstrapApplication, application,
    type ChainableApplicationContext, downloadFile, modifyJsonFile, schematic, workspace
} from '@hug/ngx-schematics-utilities';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { Builders } from '@schematics/angular/utility/workspace-models';

import type { NgAddOptions } from './ng-add-options';

export const provideLib = ({ tree, project }: ChainableApplicationContext, options: NgAddOptions): Rule => {
    const rules: Rule[] = [];

    // Provide library
    let opts = 'enabled: !isDevMode()';
    if (options.disableClose) {
        opts += ',\n' +
            'dialogOptions: {\n' +
            '  disableClose: true\n' +
            '}\n';
    }

    if (project.isStandalone) {
        rules.push(addImportToFile(project.mainConfigFilePath ?? project.mainFilePath, 'isDevMode', '@angular/core'));
        rules.push(addProviderToBootstrapApplication(
            project.mainFilePath,
            `provideAppUpdater({\n${tags.indentBy(2)`${opts}`}\n})`,
            '@hug/ngx-app-updater'
        ));
    } else {
        let appModulePath = project.pathFromSourceRoot('app/app-module.ts'); // for Angular 20+
        if (!tree.exists(appModulePath)) {
            appModulePath = project.pathFromSourceRoot('app/app.module.ts'); // for Angular < 20
        }
        rules.push(addImportToFile(appModulePath, 'isDevMode', '@angular/core'));
        rules.push(addImportToNgModule(
            appModulePath,
            `NgxAppUpdaterModule.forRoot({\n${tags.indentBy(2)`${opts}`}\n})`,
            '@hug/ngx-app-updater'
        ));
    }

    return chain(rules);
};

export default (options: NgAddOptions): Rule =>
    (tree: Tree): Rule => {
        const pkgJson = new JSONFile(tree, 'package.json');

        return schematic('app-updater', [
            workspace()
                // Add dependencies
                .addPackageJsonDependencies([{
                    name: '@angular/service-worker',
                    version: pkgJson.get(['dependencies', '@angular/core']) as string
                }])
                .packageInstallTask()

                // Deploy files
                .deployFiles({
                    appName: pkgJson.get(['appName']) ?? options.project
                })

                .toRule(),

            application(options.project)
                // Deploy icons
                .rule(({ project }: ChainableApplicationContext) => {
                    const sizes = ['192', '384', '512', '1024'];
                    return chain(
                        sizes.map(size => downloadFile(
                            `https://cdn.hug.ch/icons/hug/hug-icon-${size}x${size}.png`,
                            project.pathFromSourceRoot(`assets/icons/icon-${size}x${size}.png`)
                        ))
                    );
                })

                // Modify angular.json
                .addAngularJsonAsset('src/manifest.webmanifest')
                .rule(({ project }: ChainableApplicationContext) => {
                    const buildPath = ['projects', project.name, 'architect', 'build'];
                    const builder = (new JSONFile(tree, 'angular.json').get(buildPath) as Record<string, string>)['builder'] as Builders;
                    if (builder === Builders.Application) {
                        return modifyJsonFile('angular.json', [...buildPath, 'configurations', 'production', 'serviceWorker'], 'ngsw-config.json');
                    } else {
                        return chain([
                            modifyJsonFile('angular.json', [...buildPath, 'options', 'serviceWorker'], true),
                            modifyJsonFile('angular.json', [...buildPath, 'options', 'ngswConfigPath'], 'ngsw-config.json')
                        ]);
                    }
                })

                // Modify index.html
                .rule(({ project }: ChainableApplicationContext) => {
                    const indexHtmlPath = project.pathFromSourceRoot('index.html');
                    let indexHtmlContent = tree.read(indexHtmlPath)?.toString('utf-8') ?? '';
                    let needsOverwrite = false;
                    // Add manifest link
                    if (!indexHtmlContent.includes('<link rel="manifest"')) {
                        const manifest = '<link rel="manifest" href="manifest.webmanifest">';
                        indexHtmlContent = indexHtmlContent.replace('</head>', `  ${manifest}\n</head>`);
                        needsOverwrite = true;
                    }
                    // Add theme-color metadata
                    if (!indexHtmlContent.includes('<meta name="theme-color"')) {
                        const themeColor = '<meta name="theme-color" content="#fffff">';
                        indexHtmlContent = indexHtmlContent.replace('</head>', `  ${themeColor}\n</head>`);
                        needsOverwrite = true;
                    }
                    // Add noscript tag
                    if (!indexHtmlContent.includes('<noscript>')) {
                        const noscript = '<noscript>Please enable JavaScript to continue using this application.</noscript>';
                        indexHtmlContent = indexHtmlContent.replace('</body>', `  ${noscript}\n</body>`);
                        needsOverwrite = true;
                    }
                    if (needsOverwrite) {
                        tree.overwrite(indexHtmlPath, indexHtmlContent);
                    }
                })

                // Provide the library
                .rule(context => provideLib(context, options))

                // Log info
                .logAction('Have a look at `manifest.webmanifest` and `ngsw-config.json` files and update them according to your needs')
                .logAction('Have a look at `icons` and `screenshots` assets folders and update them according to your needs')

                .toRule()
        ], options);
    };
