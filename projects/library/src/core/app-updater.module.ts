import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { ServiceWorkerModule, SwRegistrationOptions } from '@angular/service-worker';

import { AppUpdaterDialogModule } from './components/dialog/app-updater-dialog.module';
import { AppUpdaterConfig } from './models/app-updater-config.model';
import { AppUpdaterOptions } from './models/app-updater-options.model';
import { AppUpdaterService } from './services/app-updater.service';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function appInitializerFactory(appUpdaterService: AppUpdaterService): () => void {
    return (): void => appUpdaterService.init();
}

@NgModule({
    imports: [
        AppUpdaterDialogModule,
        ServiceWorkerModule.register('ngsw-worker.js')
    ]
})
export class AppUpdaterModule {
    public static forRoot(config: AppUpdaterConfig): ModuleWithProviders<AppUpdaterModule> {
        return {
            ngModule: AppUpdaterModule,
            providers: [
                AppUpdaterService,
                {
                    provide: APP_INITIALIZER,
                    useFactory: appInitializerFactory,
                    deps: [AppUpdaterService],
                    multi: true
                },
                {
                    provide: AppUpdaterOptions,
                    useValue: config
                },
                {
                    provide: SwRegistrationOptions,
                    useValue: {
                        registrationStrategy: 'registerWhenStable:5000',
                        enabled: config.enabled,
                        ...config.swRegistrationOptions
                    }
                }
            ]
        };
    }
}
