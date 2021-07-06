import { Inject, Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { interval, Subscription } from 'rxjs';

import { AppUpdaterDialogComponent } from '../components/dialog/app-updater-dialog.component';
import { AppUpdaterConfig, AppUpdaterOptions } from '../models';

@Injectable()
export class AppUpdaterService implements OnDestroy {
    private availableSub$: Subscription | undefined;
    private activatedSub$: Subscription | undefined;
    private intervalSub$: Subscription | undefined;

    constructor(
        @Inject(AppUpdaterOptions) private options: AppUpdaterConfig,
        private swUpdate: SwUpdate,
        private dialog: MatDialog
    ) { }

    public ngOnDestroy(): void {
        if (this.availableSub$) {
            this.availableSub$.unsubscribe();
        }
        if (this.activatedSub$) {
            this.activatedSub$.unsubscribe();
        }
        if (this.intervalSub$) {
            this.intervalSub$.unsubscribe();
        }
    }

    // --- PUBLIC API(s) ---

    public init(): void {
        if (this.swUpdate.isEnabled) {
            // Observe available update
            this.observeUpdate();

            // Observe activated update
            this.activatedSub$ = this.swUpdate
                .activated
                .subscribe(() => document.location.reload());

            // Check for update on an interval period (default: 60s)
            if (!this.options.disableCheck) {
                const period = (this.options.checkInterval) ? this.options.checkInterval : 60 * 1000;
                this.intervalSub$ = interval(period)
                    .subscribe(() => void this.swUpdate.checkForUpdate());
            }
        }
    }

    public observeUpdate(enabled = true): void {
        if (this.availableSub$) {
            this.availableSub$.unsubscribe();
        }

        if (enabled) {
            this.availableSub$ = this.swUpdate
                .available
                .subscribe(event => {
                    if (event.current !== event.available) {
                        if (this.options.autoUpdate) {
                            void this.swUpdate.activateUpdate();
                        } else {
                            this.promptUser();
                        }
                    }
                });
        }
    }

    // --- HELPER(s) ---

    private promptUser(): void {
        const dialogTemplate = this.options?.dialogTemplate || AppUpdaterDialogComponent;
        const dialogRef = this.dialog.open(dialogTemplate, {
            width: '90%',
            maxWidth: '400px',
            autoFocus: false,
            hasBackdrop: true,
            disableClose: true,
            ...this.options?.dialogConfig?.matDialogConfig
        });

        dialogRef.afterClosed().subscribe(shouldUpdate => {
            if (shouldUpdate) {
                void this.swUpdate.activateUpdate();
            }
        });
    }
}
