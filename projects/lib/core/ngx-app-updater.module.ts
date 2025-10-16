import { type ModuleWithProviders, NgModule } from '@angular/core';

import type { NgxAppUpdaterOptions } from './models/ngx-app-updater-options.model';
import { NGX_APP_UPDATER_PROVIDERS } from './ngx-app-updater';

@NgModule()
export class NgxAppUpdaterModule {
    public static forRoot(options?: NgxAppUpdaterOptions): ModuleWithProviders<NgxAppUpdaterModule> {
        return {
            ngModule: NgxAppUpdaterModule,
            providers: NGX_APP_UPDATER_PROVIDERS(options)
        };
    }
}
