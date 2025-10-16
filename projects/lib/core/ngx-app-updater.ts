import { ENVIRONMENT_INITIALIZER, type EnvironmentProviders, inject, InjectionToken, type Provider } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

import { NgxAppUpdaterDialogService } from './dialog';
import type { NgxAppUpdaterOptions } from './models/ngx-app-updater-options.model';
import { NgxAppUpdaterService } from './ngx-app-updater.service';


export const NGX_APP_UPDATER_OPTIONS = new InjectionToken<NgxAppUpdaterOptions>('NGX_APP_UPDATER_OPTIONS');

export const NGX_APP_UPDATER_PROVIDERS = (options?: NgxAppUpdaterOptions): (Provider | EnvironmentProviders)[] => [
    NgxAppUpdaterDialogService,
    {
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        provide: ENVIRONMENT_INITIALIZER,
        useValue: () => inject(NgxAppUpdaterService),
        multi: true
    },
    {
        provide: NGX_APP_UPDATER_OPTIONS,
        useValue: {
            // --- defaults
            checkInterval: 60 * 1000, // default: 60s,
            promptInterval: 24 * 60 * 60 * 1000, // default: 1d
            dialogOptions: {
                width: '90%',
                maxWidth: '400px',
                disableClose: false
            },
            // ---
            ...options
        } satisfies NgxAppUpdaterOptions
    },
    provideServiceWorker('ngsw-worker.js', {
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:5000',
        enabled: options?.enabled ?? false,
        // eslint-disable-next-line @typescript-eslint/no-misused-spread
        ...options?.swRegistrationOptions
    })
];
