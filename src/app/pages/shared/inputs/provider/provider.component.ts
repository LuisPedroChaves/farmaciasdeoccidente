import { AfterContentInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ProviderService } from 'src/app/core/services/httpServices/provider.service';
import { ProviderItem } from '../../../../core/models/Provider';

@Component({
  selector: 'app-provider',
  template: `
  <mat-form-field fxFill appearance="outline" color="accent">
      <mat-label>Nit</mat-label>
      <input matInput [formControl]="_provider" [matAutocomplete]="auto1" type="text" placeholder="Buscar proveedor..." aria-label="text">
      <mat-hint>Ingrese el numero de NIT del proveedor.</mat-hint>
      <mat-autocomplete autoActiveFirstOption #auto1="matAutocomplete" (optionSelected)="selected($event.option.value)">
          <mat-option *ngIf="new" [value]="null" (click)="emitNew.emit();">
            <mat-icon>add</mat-icon>
              Nuevo proveedor
            </mat-option>
          <mat-option *ngFor="let option of filteredOptions | async" [value]="option.nit">
              <span>{{ option.nit }} - {{option.name}}</span>
          </mat-option>
      </mat-autocomplete>
      <button *ngIf="_provider.value" matSuffix mat-icon-button aria-label="Clear" (click)="clear()">
        <mat-icon>close</mat-icon>
      </button>
</mat-form-field>
  `,
  styles: []
})
export class ProviderComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() isExpenses = false;
  @Output() send = new EventEmitter<ProviderItem>();
  @Input() new = false;
  @Output() emitNew = new EventEmitter<null>();

  providersSubscription: Subscription;
  providers: ProviderItem[];
  filteredOptions: Observable<ProviderItem[]>;

  _provider = new FormControl(null, Validators.required);

  constructor(
    private providerService: ProviderService,
  ) {
    if (!this.isExpenses) {
      this.providersSubscription = this.providerService.readData().subscribe((data) => {
        this.providers = data;
      });
    }
  }

  ngOnInit(): void {
    this.filteredOptions = this._provider.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProviders(value))
    );
  }

  ngAfterContentInit(): void {
    if (!this.isExpenses) {
      this.providerService.loadData();
    } else {
      this.providerService.getExpenses()
        .subscribe(data => {
          this.providers = data
        });
    }
  }

  ngOnDestroy(): void {
    if (!this.isExpenses) {
      this.providersSubscription?.unsubscribe();
    }
  }

  private _filterProviders(value: string): ProviderItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.providers.filter((option) =>
        option.nit.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  selected(nit: string) {
    this.send.emit(
      this.providers.find(p => p.nit === nit)
    );
  }

  clear() {
    this._provider.setValue('')
    this.send.emit(null);
  }

}
