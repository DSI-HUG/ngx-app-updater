import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { NgxAppUpdaterService } from '@hug/ngx-app-updater';

import { NOT_FOUND_ICON } from './ngx-app-updater-not-found.icons';

@Component({
    standalone: true,
    selector: 'ngx-app-updater-not-found-page',
    templateUrl: './ngx-app-updater-not-found.page.html',
    styleUrls: ['./ngx-app-updater-not-found.page.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [NgTemplateOutlet, NgClass, RouterModule]
})
export class NgxAppUpdaterNotFoundPage implements OnInit, OnDestroy {
    public NOT_FOUND_ICON = inject(DomSanitizer).bypassSecurityTrustHtml(NOT_FOUND_ICON);

    public appUpdaterService = inject(NgxAppUpdaterService);
    public options = this.appUpdaterService.options?.notFoundOptions;
    public updateAvailable = false;
    public checkingUpdate = true;

    private router = inject(Router);

    public ngOnInit(): void {
        // Avoid NgxAppUpdaterService to display a dialog or apply an update
        this.appUpdaterService.canApplyUpdate = false;

        // Observe updates ourselves
        this.appUpdaterService
            .updateAvailable$
            .subscribe(() => {
                this.updateAvailable = true;
                this.checkingUpdate = false;
            });

        // Force the progress spinner to timeout after 6 seconds
        setTimeout(() => this.checkingUpdate = false, 6000);
    }

    public async goBackHome(): Promise<void> {
        await this.router.navigateByUrl('/');
    }

    public ngOnDestroy(): void {
        this.appUpdaterService.canApplyUpdate = true;
    }
}
