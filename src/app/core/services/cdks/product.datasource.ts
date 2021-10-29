import { CollectionViewer, DataSource } from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";

import { ProductService } from "../httpServices/product.service";
import { ProductItem } from "../../models/Product";

export class ProductsDataSource implements DataSource<ProductItem> {

    private productsSubject = new BehaviorSubject<ProductItem[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private productService: ProductService) {
    }

    loadProducts(
        pageIndex: number,
        pageSize: number,
        search: string
        ) {

        this.loadingSubject.next(true);

        this.productService
            .loadData(pageIndex, pageSize, search)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(products => this.productsSubject.next(products));
    }

    connect(collectionViewer: CollectionViewer): Observable<ProductItem[]> {
        // console.log("Connecting data source");
        return this.productsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.productsSubject.complete();
        this.loadingSubject.complete();
    }

}