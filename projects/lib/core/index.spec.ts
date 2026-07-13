import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

import { NgxAppUpdaterModule } from './ngx-app-updater.module';
import { provideAppUpdater } from './ngx-app-updater.provider';
import { NgxAppUpdaterService } from './ngx-app-updater.service';

beforeAll(() => {
    TestBed.initTestEnvironment(
        BrowserTestingModule,
        platformBrowserTesting(),
    );
});

describe('lib - NgModule approach', () => {
    let appUpdaterModule: NgxAppUpdaterModule;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxAppUpdaterModule.forRoot()],
        });
        appUpdaterModule = TestBed.inject(NgxAppUpdaterModule);
    });

    it('should create the module', () => {
        expect(appUpdaterModule).toBeTruthy();
    });
});

describe('lib - Provider function approach', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideAppUpdater()],
        });
    });

    it('should bootstrap the service', () => {
        const service = TestBed.inject(NgxAppUpdaterService);
        expect(service).toBeTruthy();
    });
});
