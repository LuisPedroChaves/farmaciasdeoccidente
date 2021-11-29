import { CollectionViewer, DataSource } from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";

import { TempStorageItem } from '../../models/TempStorage';
import { TempStorageService } from '../httpServices/temp-storage.service';

export class tempStorageDataSource implements DataSource<TempStorageItem> {

    private tempStorageSubject = new BehaviorSubject<TempStorageItem[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private tempStorageService: TempStorageService) {
    }

    loadTempStorage(
        _cellar,
        pageIndex: number,
        pageSize: number,
        search: string,
        brand: string
        ) {

        this.loadingSubject.next(true);

        this.tempStorageService
            .loadData(_cellar, pageIndex, pageSize, search, brand)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(tempStorages => this.tempStorageSubject.next(tempStorages));
    }

    connect(collectionViewer: CollectionViewer): Observable<TempStorageItem[]> {
        console.log("Connecting data source");
        return this.tempStorageSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.tempStorageSubject.complete();
        this.loadingSubject.complete();
    }

}