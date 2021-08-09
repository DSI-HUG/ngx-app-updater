import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { AppUpdaterModule } from './app-updater.module';
import { AppUpdaterService } from './services/app-updater.service';

describe('NgxAppUpdaterService', () => {
    let service: AppUpdaterService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                AppUpdaterModule.forRoot({
                    enabled: false
                })
            ]
        });
        service = TestBed.inject(AppUpdaterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
