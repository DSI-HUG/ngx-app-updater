import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppUpdaterNotFoundPage } from './app-updater-not-found.page';

const routes: Routes = [
    { path: '', component: AppUpdaterNotFoundPage }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppUpdaterNotFoundRoutingModule { }
