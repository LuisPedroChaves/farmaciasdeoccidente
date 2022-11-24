import {
  AfterContentInit,
  Component,
  OnDestroy,
  OnInit,
  Provider,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/operators';
import { ProviderItem } from 'src/app/core/models/Provider';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { ProviderService } from 'src/app/core/services/httpServices/provider.service';
import { EventBusService } from 'src/app/core/services/internal/event-bus.service';
import { XlsxService } from 'src/app/core/services/internal/XlsxService.service';
import { AppState } from 'src/app/store/app.reducer';
import { EditProviderComponent } from '../edit-provider/edit-provider.component';
import { NewProviderComponent } from '../new-provider/new-provider.component';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss'],
})
export class ProvidersComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  smallScreen = window.innerWidth < 960 ? true : false;

  // sessionsubscription: Subscription;
  providersSubscription: Subscription;

  selectedProvider: ProviderItem;
  providers: ProviderItem[];

  // providersp: string[];

  dataSource = new MatTableDataSource();
  columnsToDisplay = ['name', 'nit', 'phone', 'address', 'email', 'creditDays', 'credit'];
  columnsToDisplay2 = [
    'name',
    'nit',
    'phone',
    'address',
    'email',
    'creditDays',
    'credit'
  ];
  expandedElement: ProviderItem | null;

  constructor(
    public store: Store<AppState>,
    public eventBus: EventBusService,
    public config: ConfigService,
    public dialog: MatDialog,
    public providerService: ProviderService,
    private xlsxService: XlsxService
  ) {}

  ngOnInit(): void {
    // this.sessionsubscription = this.store
    //   .select('session')
    //   .pipe(filter((session) => session !== null))
    //   .subscribe((session) => {
    //     console.log(session);
    //     if (session.permissions !== null) {
    //       const b = session.permissions.filter((pr) => pr.name === 'providers');
    //       this.providersp = b.length > 0 ? b[0].options : [];
    //     }
    //   });
    this.providersSubscription = this.providerService
      .readData()
      .subscribe((data) => {
        this.providers = data;
        this.dataSource = new MatTableDataSource(this.providers);
      });
  }
  ngAfterContentInit(): void {
    this.providerService.loadData();
  }

  ngOnDestroy(): void {
    this.providersSubscription?.unsubscribe();
    // this.sessionsubscription?.unsubscribe();
  }
  newProvider(): void {
    const dialogRef = this.dialog.open(NewProviderComponent, {
      width: this.smallScreen ? '100%' : '800px',
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.providerService.loadData();
      }
    });
  }

  editProvider(provider: ProviderItem): void {
    const dialogRef = this.dialog.open(EditProviderComponent, {
      width: this.smallScreen ? '100%' : '800px',
      data: { provider },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.providerService.loadData();
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  downloadXlsx(): void {

    const body = [
      ['Catálogo de Proveedores'],
      ['Código','Nombre', 'Cheque a nombre de', 'Dirección', 'Nit', 'Teléfono', 'Email']
    ];

    const ArrayToPrint: any[] = [];

    this.providers.forEach(item => {
      const row: any[] = [];

      row.push(item['code']);
      row.push(item['name']);
      row.push(item['checkName']);
      row.push(item['address']);
      row.push(item['nit']);
      row.push(item['phone']);
      row.push(item['email']);

      ArrayToPrint.push(row);
    });

    ArrayToPrint.forEach((row) => body.push(row));

    this.xlsxService.downloadSinglePage(
      body,
      'Catálogo de Proveedores',
      'Catálogo de Proveedores'
    );
  }
}
