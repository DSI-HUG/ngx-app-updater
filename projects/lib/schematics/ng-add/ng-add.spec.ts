import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { ApplicationDefinition, getProjectFromWorkspace, modifyJsonFile } from '@hug/ngx-schematics-utilities';
import { Builders } from '@schematics/angular/utility/workspace-models';

import { appTest1, callRule, getCleanAppTree, runner } from '../schematics.spec';
import { NgAddOptions } from './ng-add-options';

const joc = jasmine.objectContaining;
const jac = jasmine.arrayContaining;

[false, true].forEach(useStandalone => {
    [false, true].forEach(useWorkspace => {
        describe(`schematics - ng-add - (using${useStandalone ? ' standalone' : ''}${useWorkspace ? ' workspace' : ' flat'} project)`, () => {
            let defaultOptions: NgAddOptions;
            let tree: UnitTestTree;
            let nbFiles: number;
            let project: ApplicationDefinition;

            beforeEach(async () => {
                tree = await getCleanAppTree(useWorkspace, useStandalone);
                nbFiles = tree.files.length;
                defaultOptions = {
                    project: appTest1.name
                } as NgAddOptions;
                project = await getProjectFromWorkspace(tree, defaultOptions.project);
            });

            it('should run without issues', async () => {
                const test$ = runner.runSchematic('ng-add', defaultOptions, tree);
                await expectAsync(test$).toBeResolved();
                expect(tree.files.length).toEqual(nbFiles + 4 + 4);
            });

            it('should update angular.json (application builder)', async () => {
                await callRule(modifyJsonFile('angular.json', ['projects', appTest1.name, 'architect', 'build', 'builder'], Builders.Application), tree);
                await runner.runSchematic('ng-add', defaultOptions, tree);
                expect(tree.readJson('angular.json')).toEqual(joc({
                    projects: joc({
                        [appTest1.name]: joc({
                            architect: joc({
                                build: joc({
                                    options: joc({
                                        assets: jac([
                                            'src/manifest.webmanifest'
                                        ])
                                    }),
                                    configurations: joc({
                                        production: joc({
                                            serviceWorker: 'ngsw-config.json'
                                        })
                                    })
                                })
                            })
                        })
                    })
                }));
            });

            it('should update angular.json (browser builder)', async () => {
                await callRule(modifyJsonFile('angular.json', ['projects', appTest1.name, 'architect', 'build', 'builder'], Builders.Browser), tree);
                await callRule(modifyJsonFile('angular.json',
                    ['projects', appTest1.name, 'architect', 'build', 'options', 'main'],
                    project.targets.get('build')?.options?.['browser']
                ), tree);
                await runner.runSchematic('ng-add', defaultOptions, tree);
                expect(tree.readJson('angular.json')).toEqual(joc({
                    projects: joc({
                        [appTest1.name]: joc({
                            architect: joc({
                                build: joc({
                                    options: joc({
                                        serviceWorker: true,
                                        ngswConfigPath: 'ngsw-config.json',
                                        assets: jac([
                                            'src/manifest.webmanifest'
                                        ])
                                    })
                                })
                            })
                        })
                    })
                }));
            });

            if (useStandalone) {
                it('should update app.config.ts', async () => {
                    await runner.runSchematic('ng-add', defaultOptions, tree);
                    const configTsContent = tree.readContent(project.mainConfigFilePath!);
                    expect(configTsContent).toContain('import { ApplicationConfig, isDevMode } from \'@angular/core\';');
                    expect(configTsContent).toContain('import { provideAppUpdater } from \'@hug/ngx-app-updater\';');
                    expect(configTsContent).toContain('provideAppUpdater({\n' +
                    '      enabled: !isDevMode()\n' +
                    '    })');
                });

                it('should update app.config.ts (with disableClose)', async () => {
                    await runner.runSchematic('ng-add', { ...defaultOptions, disableClose: true }, tree);
                    const configTsContent = tree.readContent(project.mainConfigFilePath!);
                    expect(configTsContent).toContain('import { ApplicationConfig, isDevMode } from \'@angular/core\';');
                    expect(configTsContent).toContain('import { provideAppUpdater } from \'@hug/ngx-app-updater\';');
                    expect(configTsContent).toContain('provideAppUpdater({\n' +
                    '      enabled: !isDevMode(),\n' +
                    '      dialogOptions: {\n' +
                    '        disableClose: true\n' +
                    '      }\n' +
                    '    })');
                });
            }

            it('should update app.module.ts', async () => {
                await runner.runSchematic('ng-add', defaultOptions, tree);
                const mainTsContent = tree.readContent(project.pathFromSourceRoot('app/app.module.ts'));
                if (useStandalone) {
                    expect(mainTsContent).not.toContain('import { NgModule, isDevMode } from \'@angular/core\';');
                    expect(mainTsContent).not.toContain('import { NgxAppUpdaterModule } from \'@hug/ngx-app-updater\';');
                    expect(mainTsContent).not.toContain('NgxAppUpdaterModule.forRoot({\n' +
                    '      enabled: !isDevMode()\n' +
                    '    })');
                } else {
                    expect(mainTsContent).toContain('import { NgModule, isDevMode } from \'@angular/core\';');
                    expect(mainTsContent).toContain('import { NgxAppUpdaterModule } from \'@hug/ngx-app-updater\';');
                    expect(mainTsContent).toContain('NgxAppUpdaterModule.forRoot({\n' +
                    '      enabled: !isDevMode()\n' +
                    '    })');
                }
            });

            if (!useStandalone) {
                it('should update app.module.ts (with disableClose)', async () => {
                    await runner.runSchematic('ng-add', { ...defaultOptions, disableClose: true }, tree);
                    const mainTsContent = tree.readContent(project.pathFromSourceRoot('app/app.module.ts'));
                    expect(mainTsContent).toContain('import { NgModule, isDevMode } from \'@angular/core\';');
                    expect(mainTsContent).toContain('import { NgxAppUpdaterModule } from \'@hug/ngx-app-updater\';');
                    expect(mainTsContent).toContain('NgxAppUpdaterModule.forRoot({\n' +
                        '      enabled: !isDevMode(),\n' +
                        '      dialogOptions: {\n' +
                        '        disableClose: true\n' +
                        '      }\n' +
                        '    })');
                });
            }
        });
    });
});
