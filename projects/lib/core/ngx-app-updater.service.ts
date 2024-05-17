import { ApplicationRef, inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concatMap, first, from, map, Observable, of, repeat, ReplaySubject, Subscription, takeWhile, tap } from 'rxjs';

import { NgxAppUpdaterDialogService } from './dialog';
import { NgxAppUpdaterOptions } from './models/ngx-app-updater-options.model';
import { NGX_APP_UPDATER_OPTIONS } from './ngx-app-updater';

@Injectable({
    providedIn: 'root'
})
export class NgxAppUpdaterService implements OnDestroy {
    public canApplyUpdate = true;

    private dialog = inject(NgxAppUpdaterDialogService, { self: true });
    private appRef = inject(ApplicationRef);
    private swUpdate = inject(SwUpdate);
    private zone = inject(NgZone);
    private subs = new Subscription();

    private _options = inject(NGX_APP_UPDATER_OPTIONS);
    public get options(): NgxAppUpdaterOptions {
        return this._options;
    }

    private _updateAvailable$ = new ReplaySubject<boolean>(1);
    public get updateAvailable$(): Observable<boolean> {
        return this._updateAvailable$.asObservable();
    }

    constructor() {
        this.init();
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public applyUpdate(): void {
        this.verbose('Applying update...');
        window.location.reload();
    }

    // --- HELPER(s) ---

    private verbose(value: string): void {
        if (this.options.verbose) {
            console.log(`[ngx-app-updater] ${value}`);
        }
    }

    private applyUpdate$(): Observable<boolean> {
        return new Observable(observer => {
            if (this.canApplyUpdate) {
                if (this.options.autoUpdate) {
                    this.applyUpdate();
                    observer.next(true);
                    observer.complete();
                } else {
                    this.verbose('Prompting user...');
                    const dialogRef = this.dialog.open(this.options?.dialogOptions);
                    dialogRef.afterClosed$.subscribe(applyUpdate => {
                        if (applyUpdate) {
                            this.applyUpdate();
                        }
                        observer.next(applyUpdate);
                        observer.complete();
                    });
                }
            } else {
                observer.next(false);
                observer.complete();
            }
        });
    }

    private checkForUpdate$(): Observable<boolean> {
        return this.appRef.isStable.pipe(
            first(isStable => isStable),
            tap(() => this.verbose('Checking for update...')),
            concatMap(() => from(this.swUpdate.checkForUpdate())),
            concatMap(updateAvailable => {
                let log = updateAvailable ? 'Update available' : 'No update available';
                if (!updateAvailable && this.options.checkInterval) {
                    log += ` (retrying in ${this.options.checkInterval / 1000}s)`;
                }
                this.verbose(log);

                if (updateAvailable) {
                    /**
                     * Notify about the update
                     * (it actually doesn't run inside Angular (don't know why..) so with have to use NgZone)
                     */
                    this.zone.run(() => {
                        this._updateAvailable$.next(true);
                        this._updateAvailable$.complete();
                    });

                    // Apply the update
                    return this.applyUpdate$().pipe(
                        repeat({ delay: (this.options.promptInterval) ? this.options.promptInterval : 0 }),
                        takeWhile(updateApplied => {
                            const take = ((this.options.promptInterval !== false) && !updateApplied);
                            if (take && this.options.promptInterval) {
                                this.verbose(`Re-prompting in ${this.options.promptInterval / 1000}s`);
                            }
                            return take;
                        }),
                        map(() => true)
                    );
                }
                return of(false);
            }),
            repeat({ delay: (this.options.checkInterval) ? this.options.checkInterval : 0 }),
            takeWhile(updateAvailable =>
                (this.options.checkInterval !== false) || ((this.options.promptInterval !== false) && updateAvailable)
            )
        );
    }

    private init(): void {
        if (this.swUpdate.isEnabled) {
            /**
             * Listen for update events
             * (only for debugging purpose as those events are not always reliable)
             */
            this.subs.add(
                this.swUpdate.versionUpdates.subscribe(event => {
                    switch (event.type) {
                        case 'VERSION_DETECTED':
                            this.verbose(`Downloading new app version (${event.version.hash})...`);
                            break;
                        case 'VERSION_READY':
                            this.verbose('New app version is ready to use:');
                            this.verbose(`-> current (${event.currentVersion.hash})`);
                            this.verbose(`-> new (${event.latestVersion.hash})`);
                            break;
                        case 'VERSION_INSTALLATION_FAILED':
                            console.error(`[ngx-app-updater] Failed to install app version (${event.version.hash}): ${event.error}`);
                            break;
                        // case 'NO_NEW_VERSION_DETECTED':
                        //     this.verbose('No new version detected');
                        //     break;
                        default:
                            break;
                    }
                })
            );

            // Listen for unrecoverable events
            this.subs.add(
                this.swUpdate.unrecoverable.subscribe(() => {
                    console.error('[ngx-app-updater] App is in unrecoverable state: reloading to avoid chunk load issues...');
                    this.applyUpdate();
                })
            );

            // Check for update
            this.subs.add(
                this.checkForUpdate$().subscribe({
                    complete: () => this.verbose('Service stopped')
                })
            );
        } else {
            this.verbose('Service is not enabled');
        }
    }
}
