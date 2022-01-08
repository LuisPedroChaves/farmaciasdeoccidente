import { AfterContentInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CellarItem } from '../../../../core/models/Cellar';
import { CellarService } from '../../../../core/services/httpServices/cellar.service';

@Component({
    selector: 'app-cellar',
    template: `
        <mat-form-field fxFill appearance="outline" color="accent">
            <mat-label>Sucursal</mat-label>
            <mat-select [formControl]="cellar">
                <mat-option *ngFor="let c of cellars" [value]="c._id">
                    {{ c.name }}
                </mat-option>
            </mat-select>
        </mat-form-field>
  `,
    styles: []
})
export class CellarComponent implements OnInit, AfterContentInit, OnDestroy {

    @Input() onlyBodegas: boolean = false;
    @Output() send = new EventEmitter<CellarItem>();

    cellarsSubscription: Subscription;
    cellars: CellarItem[];

    cellar = new FormControl();

    constructor(
        private cellarService: CellarService
    ) {
        this.cellarsSubscription = this.cellarService
        .readData()
        .subscribe((data: CellarItem[]) => {
            this.cellars = data;
            if (this.onlyBodegas) {
                this.cellars = this.cellars.filter(c => c.type === 'BODEGA');
            }
        });
    }

    ngOnInit(): void {
        this.cellar.valueChanges.subscribe(id => {
            this.send.emit(
                this.cellars.find(c => c._id === id)
            );
        });
    }

    ngAfterContentInit(): void {
        this.cellarService.loadData();
    }

    ngOnDestroy(): void {
        this.cellarsSubscription?.unsubscribe();
    }
}
