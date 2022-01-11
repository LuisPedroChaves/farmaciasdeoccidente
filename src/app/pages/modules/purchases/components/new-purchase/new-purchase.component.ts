import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { BehaviorSubject } from 'rxjs';

import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import {
  PurchaseDetailItem,
  PurchaseItem,
} from '../../../../../core/models/Purchase';
import { PurchaseService } from '../../../../../core/services/httpServices/purchase.service';
import { UploadFileService } from '../../../../../core/services/httpServices/upload-file.service';

@Component({
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class NewPurchaseComponent
  implements OnInit {
  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  @ViewChild('noBill') noBill: ElementRef<HTMLInputElement>;

  get detailForm(): FormArray {
    return this.form.get('detail') as FormArray;
  }

  form = new FormGroup({
    _id: new FormControl(null),
    _user: new FormControl(null),
    _provider: new FormControl(null, Validators.required),
    noBill: new FormControl('', Validators.required),
    created: new FormControl(null, Validators.required),
    date: new FormControl(Validators.required),
    requisition: new FormControl(''),
    details: new FormControl(''),
    detail: this.FormBuilder.array([]),
    total: new FormControl(0, Validators.required),
    file: new FormControl(''),
    state: new FormControl('', Validators.required),
  });

  formDetail = new FormGroup({
    presentation: new FormControl(null, Validators.required),
    _product: new FormControl(null, Validators.required),
    requested: new FormControl(0, Validators.required),
    quantity: new FormControl(0, Validators.required),
    price: new FormControl('', Validators.required),
    bonus: new FormControl(0, Validators.required),
    discount: new FormControl(0, Validators.required),
    total: new FormControl(0, Validators.required),
    cost: new FormControl(0, Validators.required),
    realQuantity: new FormControl(0, Validators.required),
    expirationDate: new FormControl(''),
  });

  displayedColumns: string[] = ['presentation', '_product', 'quantity', 'price', 'bonus', 'discount', 'total', 'cost', 'realQuantity', 'expirationDate'];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);

  constructor(
    public toasty: ToastyService,
    public purchaseService: PurchaseService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private FormBuilder: FormBuilder,
    public uploadFileService: UploadFileService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.params.subscribe((params) => {
      this.purchaseService.getById(params.id).subscribe(data => {
        this.form.get('_id').setValue(data.purchase._id);
        this.form.get('_provider').setValue(data.purchase._provider);
        this.form.get('_user').setValue(data.purchase._user);
        this.form.get('requisition').setValue(data.purchase.requisition);
        this.form.get('created').setValue(data.purchase.created);
        this.form.get('state').setValue(data.purchase.state);
        data.purchase.detail.forEach((e: PurchaseDetailItem) => {
          const NEW_DETAIL: FormGroup = this.FormBuilder.group({
            presentation: new FormControl(e.presentation, Validators.required),
            _product: new FormControl(e._product, Validators.required),
            requested: new FormControl(e.requested, Validators.required),
            quantity: new FormControl(e.requested, Validators.required),
            price: new FormControl('', Validators.required),
            bonus: new FormControl(0, Validators.required),
            discount: new FormControl(0, Validators.required),
            total: new FormControl(0, Validators.required),
            cost: new FormControl(0, Validators.required),
            realQuantity: new FormControl(e.requested, Validators.required),
            expirationDate: new FormControl(''),
          });
          this.detailForm.push(NEW_DETAIL);
          this.manageDetailControls(this.detailForm.length - 1);
        });
        this.dataSource.next(this.detailForm.controls);
        this.loading = false;
      });
    });

    setTimeout(() => {
      this.noBill.nativeElement.focus();
    }, 500);
  }

  getTotal(): number {
    let total = 0;

    this.detailForm.controls.forEach((group: FormGroup) => {
      const CONTROL = group.controls;
      total += +CONTROL.total.value;
    });
    return total;
  }

  manageDetailControls(index: number) {
    this.detailForm.at(index).get('quantity').valueChanges
      .subscribe(quantity => {
        if (quantity) {
        this.calcRealQuantity(index);
          this.calcTotal(index);
          this.calcCost(index);
        }
      });
    this.detailForm.at(index).get('price').valueChanges
      .subscribe(price => {
        if (price) {
          this.calcTotal(index);
          this.calcCost(index);
        }
      });
    this.detailForm.at(index).get('bonus').valueChanges
      .subscribe(bonus => {
        if (bonus) {
          this.calcRealQuantity(index);
          this.calcCost(index);
        }
      });
    this.detailForm.at(index).get('discount').valueChanges
      .subscribe(discount => {
        this.calcTotal(index);
        this.calcCost(index);
      });
    this.detailForm.at(index).get('total').valueChanges
      .subscribe(total => {
        if (total && this.detailForm.at(index).get('quantity').value) {
          this.detailForm.at(index).get('discount').setValue(0, { emitEvent: false });
          this.detailForm.at(index).get('bonus').setValue(0, { emitEvent: false });
          const PRICE = total / this.detailForm.at(index).get('quantity').value;
          this.detailForm.at(index).get('price').setValue(PRICE.toFixed(2), { emitEvent: false });
          this.calcCost(index);
        }
      });
  }

  calcRealQuantity(index: number): void {
    const REAL_QUANTITY: number = this.detailForm.at(index).get('quantity').value + this.detailForm.at(index).get('bonus').value;
    this.detailForm.at(index).get('realQuantity').setValue(REAL_QUANTITY)
  }

  calcCost(index: number): void {
    const COST: number =
      (this.detailForm.at(index).get('price').value * this.detailForm.at(index).get('quantity').value) /
      this.detailForm.at(index).get('realQuantity').value;
    this.detailForm.at(index).get('cost').setValue(
      (COST -
        COST * (this.detailForm.at(index).get('discount').value / 100)).toFixed(2)
    );
  }

  calcTotal(index: number): void {
    const TOTAL: number = (this.detailForm.at(index).get('quantity').value * this.detailForm.at(index).get('price').value) * (1 - (this.detailForm.at(index).get('discount').value / 100));
    this.detailForm.at(index).get('total').setValue(TOTAL.toFixed(2), { emitEvent: false });
  }

  savePurchase(): void {

    this.loading = true;
    this.form.get('total').setValue(this.getTotal());
    const PURCHASE: PurchaseItem = { ...this.form.value };
    const FILE: any = PURCHASE.file;
    if (FILE) {
      this.uploadFileService.uploadFile(FILE.files[0], 'purchases', PURCHASE._id)
      .then((resp: any) => {
      this.putPurchase(PURCHASE);
      })
      .catch(err => {
        this.loading = false;
        this.toasty.error('Error al cargar el archivo');
      });
    }else {
      this.putPurchase(PURCHASE);
    }
  }

  putPurchase(purchase: PurchaseItem): void {
    this.purchaseService.statePurchase(purchase).subscribe(
      (data) => {
        if (data.ok === true) {
          this.toasty.success('Factura ingresada exitosamente');
          this.router.navigate(['/purchases']);
          this.loading = false;
        } else {
          this.loading = false;
          this.toasty.error('Error al ingresar la factura');
        }
      },
      (err) => {
        this.loading = false;
        this.toasty.error('Error al ingresar la factura');
      }
    );
  }
}
