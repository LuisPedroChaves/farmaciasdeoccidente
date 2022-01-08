import { AfterContentInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { BrandItem } from 'src/app/core/models/Brand';
import { BrandService } from 'src/app/core/services/httpServices/brand.service';

@Component({
  selector: 'app-brand',
  template: `
  <mat-form-field fxFill appearance="outline" color="accent">
    <mat-label>Laboratorio</mat-label>
    <input matInput #brand [formControl]="_brand" [matAutocomplete]="auto1" type="text" placeholder="Buscar laboratorio..." aria-label="text">
    <mat-autocomplete autoActiveFirstOption #auto1="matAutocomplete" (optionSelected)="selected($event.option.value)">
        <mat-option *ngFor="let option of filteredOptions | async" [value]="option.name">
            <span>{{option.name}}</span>
        </mat-option>
    </mat-autocomplete>
    <button *ngIf="_brand.value" matSuffix mat-icon-button aria-label="Clear" (click)="clear()">
    <mat-icon>close</mat-icon>
  </button>
</mat-form-field>
  `,
  styles: []
})
export class BrandComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() focus: Boolean = false;
  @Output() send = new EventEmitter<BrandItem>();

  @ViewChild('brand') brand: ElementRef<HTMLInputElement>;

  brandsSubscription: Subscription;
  brands: BrandItem[];
  filteredOptions: Observable<BrandItem[]>;

  _brand = new FormControl()

  constructor(
    private brandService: BrandService
  ) { }

  ngOnInit(): void {
    this.brandsSubscription = this.brandService.readData().subscribe((data) => {
      this.brands = data;
    });
    this.filteredOptions = this._brand.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterBrands(value))
    );

    if (this.focus) {
      setTimeout(() => {
        this.brand.nativeElement.focus();
      }, 500);
    }
  }

  ngAfterContentInit(): void {
    this.brandService.loadData();
  }

  ngOnDestroy(): void {
    this.brandsSubscription?.unsubscribe();
  }

  private _filterBrands(value: string): BrandItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.brands.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  selected(name: string) {
    this.send.emit(
      this.brands.find(b => b.name === name)
    );
  }

  clear() {
    this._brand.setValue('')
    this.send.emit(undefined);
  }

}
