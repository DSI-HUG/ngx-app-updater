import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer } from '@angular/platform-browser';

import { LOGO_ICON, NOT_FOUND_ICON } from './app-updater-not-found';
import { AppUpdaterNotFoundPage } from './app-updater-not-found.page';
import { AppUpdaterNotFoundRoutingModule } from './app-updater-not-found-routing.module';

@NgModule({
    declarations: [
        AppUpdaterNotFoundPage
    ],
    imports: [
        CommonModule,
        AppUpdaterNotFoundRoutingModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class AppUpdaterNotFoundModule {
    constructor(
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer
    ) {
        this.matIconRegistry.addSvgIconLiteral('logo',
            this.domSanitizer.bypassSecurityTrustHtml(LOGO_ICON)
        );
        this.matIconRegistry.addSvgIconLiteral('not-found',
            this.domSanitizer.bypassSecurityTrustHtml(NOT_FOUND_ICON)
        );
    }
}
