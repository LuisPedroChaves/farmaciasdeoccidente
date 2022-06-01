import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { title } from 'process';
import { fromEvent, Subscription } from 'rxjs';
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { ProductItem } from 'src/app/core/models/Product';
import { StorageItem } from 'src/app/core/models/Storage';
import { ProductsDataSource } from 'src/app/core/services/cdks/product.datasource';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/store/app.reducer';
import { CellarItem } from '../../../../../core/models/Cellar';
import { ModalMovementsComponent } from '../modal-movements/modal-movements.component';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss'],
})
export class StorageComponent implements OnInit, OnDestroy, AfterViewInit {
  smallScreen = window.innerWidth < 960 ? true : false;

  inventoryGeneral = true;

  constructor() {}
  ngOnInit(): void {}
  ngOnDestroy(): void {}

  ngAfterViewInit(): void {}
}
