import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrandService } from '../../../../../core/services/httpServices/brand.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { BrandItem } from '../../../../../core/models/Brand';

@Component({
  selector: 'app-new-edit',
  templateUrl: './new-edit.component.html',
  styleUrls: ['./new-edit.component.scss']
})
export class NewEditComponent implements OnInit {

  @Input() brandForm: FormGroup;
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter<BrandItem>();

  loading = false;

  constructor(
    private brandService: BrandService,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {
  }

  newBrand() {
    this.loading = true;

    if (this.brandForm.controls._id.value) {
      this.brandService.update({ ...this.brandForm.value }).subscribe(resp => {
        this.toastyService.success('Laboratorio editado exitosamente')
        this.close.emit();
        this.save.emit(resp.brand)
        this.loading = false;
      });
    } else {
      this.brandService.create({ ...this.brandForm.value }).subscribe(resp => {
        this.toastyService.success('Laboratorio creado exitosamente')
        this.close.emit();
        this.save.emit(resp.brand)
        this.loading = false;
      });
    }
  }

}
