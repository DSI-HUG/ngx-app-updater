import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { AppUpdaterConfig } from '../../models/app-updater-config.model';
import { AppUpdaterOptions } from '../../models/app-updater-options.model';

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
