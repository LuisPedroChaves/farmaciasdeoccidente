import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filterPipes/filter.pipe';
import { MoneyPipe } from './formatPipes/money.pipe';
import { RoundDigitPipe } from './formatPipes/round-digit.pipe';
import { OrderByPipe } from './orderPipes/order-by.pipe';
import { TimeFormatPipe } from './timePipes/time-format.pipe';
import { TimestampDatePipe } from './timePipes/timestamp-date.pipe';
import { FilePipe } from './filePipes/file.pipe';
@NgModule({
  declarations: [FilterPipe, MoneyPipe, RoundDigitPipe, OrderByPipe, TimeFormatPipe, TimestampDatePipe, FilePipe],
  imports: [
    CommonModule
  ],
  exports: [
    // OrderModule,
    FilterPipe,
    OrderByPipe,
    MoneyPipe,

    // time pipes
    TimeFormatPipe,
    TimestampDatePipe,
    // format pipes
    RoundDigitPipe,
    // file pipes
    FilePipe
  ],
})
export class PipesModule { }
