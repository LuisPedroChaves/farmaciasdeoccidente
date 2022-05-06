import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-balance',
  template: `
    <mat-progress-bar mode="determinate" [value]="value" color="warn" [matTooltip]="(value > 99) ? 'Límite de crédito superado' : value + '%'" class="cursor-pointer"></mat-progress-bar>
  `,
  styleUrls: []
})
export class ProgressBalanceComponent implements OnInit {

  @Input() value: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
