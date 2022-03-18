import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-check',
  templateUrl: './new-check.component.html',
  styleUrls: ['./new-check.component.scss']
})
export class NewCheckComponent implements OnInit, OnChanges {

  @Input() name = '';
  @Input() amount = 0;
  @Output() close = new EventEmitter;

  loading = false;

  form = new FormGroup({
    no: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    name: new FormControl({
      value: '',
      disabled: true
    }, Validators.required),
    amount: new FormControl({
      value: '',
      disabled: true
    }, Validators.required),
    note: new FormControl(''),
    state: new FormControl('CREADO', Validators.required),
  });

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.name) {
        this.form.controls.name.setValue(changes.name.currentValue);
      }
      if (changes.amount) {
        this.form.controls.amount.setValue(changes.amount.currentValue);
      }
  }

  save(): void {
    this.loading = true;

  }

}
