import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-filter',
    template: `
    <mat-form-field appearance="standard" color="primary">
        <mat-label>Filtro</mat-label>
        <input matInput (keyup)="sendFilter($event)" [placeholder]="placeholder" #input>
        <button *ngIf="input.value" matSuffix mat-icon-button aria-label="Clear" (click)="clearFilter(input)">
            <mat-icon>close</mat-icon>
          </button>
    </mat-form-field>
  `,
    styles: []
})
export class FilterComponent implements OnInit {

    @Input() placeholder: string = 'Ej. patrimadol';
    @Output() send = new EventEmitter<string>();

    constructor(
    ) {
    }

    ngOnInit(): void {
    }

    sendFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.send.emit(filterValue.trim().toLowerCase())
    }

    clearFilter(input: HTMLInputElement) {
        input.value = '';
        this.send.emit(input.value);
    }
}
