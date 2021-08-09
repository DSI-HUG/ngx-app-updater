import { ComponentType } from '@angular/cdk/portal';
import { TemplateRef } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { SwRegistrationOptions } from '@angular/service-worker';

export interface AppUpdaterConfig {
    /**
     * Whether the ServiceWorker will be registered and the related services (such as `SwPush` and
     * `SwUpdate`) will attempt to communicate and interact with it.
     *
     * @default true
     */
    enabled: boolean;

    autoUpdate?: boolean;
    disableCheck?: boolean;
    checkInterval?: number;
    dialogConfig?: {
        title?: string;
        message?: string;
        update?: string;
        cancel?: string;
        matDialogConfig?: MatDialogConfig;
    };
    dialogTemplate?: ComponentType<unknown> | TemplateRef<unknown>;
    swRegistrationOptions?: SwRegistrationOptions;
}
