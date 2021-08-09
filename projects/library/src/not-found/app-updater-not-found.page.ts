import { Component, OnDestroy, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AppUpdaterService } from '@hug/ngx-app-updater';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-updater-not-found-page',
    templateUrl: './app-updater-not-found.page.html',
    styleUrls: ['./app-updater-not-found.page.scss']
})
export class AppUpdaterNotFoundPage implements OnInit, OnDestroy {
    public updateAvailable = false;
    public checkingUpdate = true;

    private availableSub$: Subscription | undefined;

    constructor(
        private appUpdaterService: AppUpdaterService,
        public swUpdate: SwUpdate
    ) { }

    public ngOnInit(): void {
        if (this.swUpdate.isEnabled) {
            // Disable update observation on AppUpdaterService to avoid displaying the dialog
            this.appUpdaterService.observeUpdate(false);

            // Observe available update
            this.availableSub$ = this.swUpdate
                .available
                .subscribe(event => {
                    this.updateAvailable = (event.current !== event.available);
                    this.checkingUpdate = false;
                });
        }

        /**
         *  Stop the progress spinner after 5sec if:
         *  - no updates are available (ie. swUpdate.checkForUpdate will never trigger an UpdateAvailableEvent)
         *  - swUpdate is not enabled
         */
        setTimeout(() => this.checkingUpdate = false, 6000);
    }

    public ngOnDestroy(): void {
        this.appUpdaterService.observeUpdate(true);
        if (this.availableSub$) {
            this.availableSub$.unsubscribe();
        }
    }
}
