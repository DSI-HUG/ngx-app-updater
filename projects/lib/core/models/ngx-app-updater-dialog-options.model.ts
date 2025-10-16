import type { Type } from '@angular/core';

export interface NgxAppUpdaterDialogOptions {
    /**
     * Title of the dialog
     */
    title?: string;
    /**
     * Message of the dialog
     */
    message?: string;
    /**
     * Label of the update button
     */
    updateLabel?: string;
    /**
     * Label of the cancel button
     */
    cancelLabel?: string;

    /**
     * Width of the dialog.
     */
    width?: string;
    /**
     * Max-width of the dialog.
     */
    maxWidth?: string;
    /**
     * Height of the dialog.
     */
    height?: string;
    /**
     * Max-height of the dialog.
     */
    maxHeight?: string;

    /**
     * True if updates should be forced to the user.
     *
     * Dismissing and cancelling the modal dialog won't be allowed.
     * @default true
     */
    disableClose?: boolean;

    /**
     * Uses the given component as the modal dialog.
     */
    component?: Type<unknown>;
}
