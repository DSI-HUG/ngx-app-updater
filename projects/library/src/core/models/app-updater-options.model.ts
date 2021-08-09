import { InjectionToken } from '@angular/core';

import { AppUpdaterConfig } from './app-updater-config.model';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AppUpdaterOptions = new InjectionToken<AppUpdaterConfig>('app-updater-options');
