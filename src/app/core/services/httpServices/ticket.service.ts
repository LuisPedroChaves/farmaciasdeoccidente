import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ITicket } from '../../models/ticket';
import { PrintService } from '../internal/print.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {


  constructor(
    private printService: PrintService,
  ) { }

  print(ticket: ITicket, rows): void {

    const ArrayToPrint: any[] = [];

    const rowArray: any[] = [];

    for (let index = 0; index < rows; index++) {

      const ROW: any[] = [
        {
          table: {
            widths: [15, 43.5196851],
            margin: [0, 0, 0, 0],
            body: [
              [
                {
                  rowSpan: 5,
                  border: [false, false, false, false],
                  image: ticket.qr64,
                  width: 28,
                  height: 28,
                  alignment: 'center'
                },
                {
                  border: [false, false, false, false],
                  text: ` PV. ${ticket.providerCode}`,
                  style: 'normalContent',
                  margin: [0, -3],
                },
              ],
              [
                '',
                {
                  border: [false, false, false, false],
                  text: `C/P: ${ticket.productCode}`,
                  style: 'blackContent',
                  margin: [0, -3],
                },
              ],
              [
                '',
                {
                  border: [false, false, false, false],
                  text: `LOTE. ${ticket.lote}`,
                  style: 'normalContent',
                  margin: [0, -3],
                },
              ],
              [
                '',
                {
                  border: [false, false, false, false],
                  text: `${ticket.productName.substring(0, 10) }...`,
                  style: 'name',
                  margin: [0, -3, 7],
                },
              ],
              [
                '',
                {
                  border: [false, false, false, false],
                  text: `V. ${moment(ticket.expiredDate).format('DD/MM/YYYY')}`,
                  style: 'normalContent',
                  margin: [0, -3],
                },
              ],
            ],
          },
        },
        {
          table: {
            widths: [15.52],
            body: [[]]
          }
        },
        {
          table: {
            widths: [15, 43.5196851],
            margin: [0, 0, 0, 0],
            body: [
              [
                {
                  rowSpan: 5,
                  border: [false, false, false, false],
                  image: ticket.qr64,
                  width: 28,
                  height: 28,
                  alignment: 'center'
                },
                {
                  border: [false, false, false, false],
                  text: ` PV. ${ticket.providerCode}`,
                  style: 'normalContent',
                  margin: [0, -3],
                },
              ],
              [
                '',
                {
                  border: [false, false, false, false],
                  text: `C/P: ${ticket.productCode}`,
                  style: 'blackContent',
                  margin: [0, -3],
                },
              ],
              [
                '',
                {
                  border: [false, false, false, false],
                  text: `LOTE. ${ticket.lote}`,
                  style: 'normalContent',
                  margin: [0, -3],
                },
              ],
              [
                '',
                {
                  border: [false, false, false, false],
                  text: `${ticket.productName.substring(0, 10) }...`,
                  style: 'name',
                  margin: [0, -3, 7],
                },
              ],
              [
                '',
                {
                  border: [false, false, false, false],
                  text: `V. ${moment(ticket.expiredDate).format('DD/MM/YYYY')}`,
                  style: 'normalContent',
                  margin: [0, -3],
                },
              ],
            ],
          },
        },
        {
          table: {
            widths: [15.52],
            body: [[]]
          }
        },
        {
          table: {
            widths: [15, 43.5196851],
            margin: [0, 0, 0, 0],
            body: [
              [
                {
                  rowSpan: 5,
                  border: [false, false, false, false],
                  image: ticket.qr64,
                  width: 28,
                  height: 28,
                  alignment: 'center'
                },
                {
                  border: [false, false, false, false],
                  text: ` PV. ${ticket.providerCode}`,
                  style: 'normalContent',
                  margin: [0, -3],
                },
              ],
              [
                '',
                {
                  border: [false, false, false, false],
                  text: `C/P: ${ticket.productCode}`,
                  style: 'blackContent',
                  margin: [0, -3],
                },
              ],
              [
                '',
                {
                  border: [false, false, false, false],
                  text: `LOTE. ${ticket.lote}`,
                  style: 'normalContent',
                  margin: [0, -3],
                },
              ],
              [
                '',
                {
                  border: [false, false, false, false],
                  text: `${ticket.productName.substring(0, 10) }...`,
                  style: 'name',
                  margin: [0, -3, 7],
                },
              ],
              [
                '',
                {
                  border: [false, false, false, false],
                  text: `V. ${moment(ticket.expiredDate).format('DD/MM/YYYY')}`,
                  style: 'normalContent',
                  margin: [0, -3],
                },
              ],
            ],
          },
        },
      ];
      rowArray.push(ROW);
    }

    rowArray.forEach((row) => {
      ArrayToPrint.push(row);
    });

    const cuerpoTickets = {
      layout: 'noBorders',
      table: {
        widths: [68.48, 15.52, 68.48, 15.52, 68.48],
        heights: [36, 36, 36, 36, 36],
        body: ArrayToPrint
      },
    };


    // const body = [{...cuerpoTickets}];

    console.log(cuerpoTickets);



    this.printService.printTicket(cuerpoTickets);

  }


}
