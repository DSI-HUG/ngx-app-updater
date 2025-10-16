import { type Observable, Subject } from 'rxjs';

import type { NgxAppUpdaterDialogOptions } from '../models';

export class NgxAppUpdaterDialogRef {
    public readonly options?: NgxAppUpdaterDialogOptions;

    private _close$ = new Subject<boolean>();
    public get afterClosed$(): Observable<boolean> {
        return this._close$.asObservable();
    }

    public constructor(options?: NgxAppUpdaterDialogOptions) {
        this.options = options;
    }

    public close(shouldUpdate: boolean): void {
        this._close$.next(shouldUpdate);
        this._close$.complete();
    }
}
