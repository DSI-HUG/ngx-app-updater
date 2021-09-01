import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { AppUpdaterDialogComponent } from './app-updater-dialog.component';

@NgModule({
    exports: [
        AppUpdaterDialogComponent
    ],
    declarations: [
        AppUpdaterDialogComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule
    ]
})
export class AppUpdaterDialogModule { }
