import { ApplicationRef, createComponent, EnvironmentInjector, inject, Injectable, Injector } from '@angular/core';

import { NgxAppUpdaterDialogOptions } from '../models/ngx-app-updater-dialog-options.model';
import { NgxAppUpdaterDialogContentComponent } from './content';
import { NgxAppUpdaterDialogComponent } from './ngx-app-updater-dialog.component';
import { NgxAppUpdaterDialogRef } from './ngx-app-updater-dialog-ref';

@Injectable()
export class NgxAppUpdaterDialogService {
    private injector = inject(EnvironmentInjector);
    private appRef = inject(ApplicationRef);

    public open(options?: NgxAppUpdaterDialogOptions): NgxAppUpdaterDialogRef {
        const dialogRef = new NgxAppUpdaterDialogRef(options);

        const contentComponent = createComponent(options?.component ?? NgxAppUpdaterDialogContentComponent, {
            environmentInjector: this.injector,
            elementInjector: Injector.create({
                providers: [{
                    provide: NgxAppUpdaterDialogRef,
                    useValue: dialogRef
                }]
            })
        });
        this.appRef.attachView(contentComponent.hostView);
        contentComponent.changeDetectorRef.detectChanges();

        const modalComponent = createComponent(NgxAppUpdaterDialogComponent, {
            environmentInjector: this.injector,
            projectableNodes: [[contentComponent.location.nativeElement as HTMLElement]],
            elementInjector: Injector.create({
                providers: [{
                    provide: NgxAppUpdaterDialogRef,
                    useValue: dialogRef
                }]
            })
        });
        this.appRef.attachView(modalComponent.hostView);
        modalComponent.changeDetectorRef.detectChanges();

        dialogRef.afterClosed$.subscribe(() => {
            (modalComponent.location.nativeElement as HTMLElement).remove();
            document.body.style.overflow = 'initial';
        });

        document.body.style.overflow = 'hidden';
        document.body.appendChild(modalComponent.location.nativeElement);

        return dialogRef;
    }
}
