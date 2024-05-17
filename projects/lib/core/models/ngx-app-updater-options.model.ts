import { SwRegistrationOptions } from '@angular/service-worker';

import { NgxAppUpdaterDialogOptions } from './ngx-app-updater-dialog-options.model';
import { NgxAppUpdaterNotFoundOptions } from './ngx-app-updater-not-found-options.model';

export interface NgxAppUpdaterOptions {
    /**
     * True if the Service is enabled.
     * @default true
     */
    enabled?: boolean;
    /**
     * True if the current client (i.e. browser tab) should be updated automatically to the latest
     * version ready for activation. False is a dialog should be prompted to the user instead.
     * @default false
     */
    autoUpdate?: boolean;
    /**
     * Time in milliseconds between each update's check.
     * False if disabled.
     * @default 60000 (60s)
     */
    checkInterval?: number | false;
    /**
     * Time in milliseconds between each user's prompt (in case the user refused an update).
     * False if disabled.
     * @default 86400000 (1d)
     */
    promptInterval?: number | false;
    /**
     * True to output additional information.
     * @default false
     */
    verbose?: boolean;
    /**
     * Dialog customization
     */
    dialogOptions?: NgxAppUpdaterDialogOptions;
    /**
     * Not found page customization
     */
    notFoundOptions?: NgxAppUpdaterNotFoundOptions;
    /**
     * Service worker configuration
     */
    swRegistrationOptions?: SwRegistrationOptions;
}
