import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild, ViewEncapsulation } from '@angular/core';

import { NgxAppUpdaterDialogRef } from './ngx-app-updater-dialog-ref';

@Component({
    standalone: true,
    selector: 'ngx-app-updater-dialog',
    templateUrl: './ngx-app-updater-dialog.component.html',
    styleUrls: ['./ngx-app-updater-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class NgxAppUpdaterDialogComponent implements AfterViewInit {
    @ViewChild('ngxAppUpdaterDialogContainer')
    private dialogContainerEl!: ElementRef<HTMLDivElement>;

    public dialogRef = inject(NgxAppUpdaterDialogRef);

    public ngAfterViewInit(): void {
        this.dialogContainerEl.nativeElement.style.width = this.dialogRef.options?.width ?? '';
        this.dialogContainerEl.nativeElement.style.maxWidth = this.dialogRef.options?.maxWidth ?? '';
        this.dialogContainerEl.nativeElement.style.height = this.dialogRef.options?.height ?? '';
        this.dialogContainerEl.nativeElement.style.maxHeight = this.dialogRef.options?.maxHeight ?? '';
    }
}
