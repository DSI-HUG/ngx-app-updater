import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';

import { NgxAppUpdaterDialogRef } from '../ngx-app-updater-dialog-ref';

@Component({
    standalone: true,
    selector: 'ngx-app-updater-dialog-content',
    templateUrl: './ngx-app-updater-dialog-content.component.html',
    styleUrls: ['./ngx-app-updater-dialog-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class NgxAppUpdaterDialogContentComponent {
    public dialogRef = inject(NgxAppUpdaterDialogRef);
}
