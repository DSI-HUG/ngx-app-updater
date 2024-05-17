import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { NgxAppUpdaterOptions } from './models/ngx-app-updater-options.model';
import { NGX_APP_UPDATER_PROVIDERS } from './ngx-app-updater';

export const provideAppUpdater = (options?: NgxAppUpdaterOptions): EnvironmentProviders =>
    makeEnvironmentProviders(NGX_APP_UPDATER_PROVIDERS(options));
