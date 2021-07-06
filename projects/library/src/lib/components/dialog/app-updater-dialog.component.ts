import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { AppUpdaterConfig, AppUpdaterOptions } from '../../models';

@Component({
    selector: 'app-updater-dialog',
    templateUrl: './app-updater-dialog.component.html',
    styleUrls: ['./app-updater-dialog.component.scss']
})

export class AppUpdaterDialogComponent {
    constructor(
        @Inject(AppUpdaterOptions) public options: AppUpdaterConfig,
        public dialogRef: MatDialogRef<AppUpdaterDialogComponent>
    ) { }
}
