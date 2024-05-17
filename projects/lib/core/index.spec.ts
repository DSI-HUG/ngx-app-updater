import { TestBed } from '@angular/core/testing';

import { NgxAppUpdaterModule } from './ngx-app-updater.module';

describe('lib', () => {
    let appUpdaterModule: NgxAppUpdaterModule;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxAppUpdaterModule]
        });
        appUpdaterModule = TestBed.inject(NgxAppUpdaterModule);
    });

    it('should be created', () => {
        expect(appUpdaterModule).toBeTruthy();
    });
});
