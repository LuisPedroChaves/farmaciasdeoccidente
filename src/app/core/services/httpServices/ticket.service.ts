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


        const ticketRow = [
            [
                {
                    table: {
                        widths: [28.34, 56],
                        body: [
                            [
                                {
                                    rowSpan: 4,
                                    border: [false, false, false, false],
                                    image: ticket.qr64,
                                    width: 26,
                                    height: 26,
                                    alignment: 'center'
                                },
                                {
                                    border: [false, false, false, false],
                                    text: ` PROVEEDOR: ${ticket.providerCode}`,
                                    style: 'normalContent',
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
                                    text: `Lote.: ${ticket.lote}`,
                                    style: 'normalContent',
                                    margin: [0, -3],
                                },
                            ],
                            [
                                '',
                                {
                                    border: [false, false, false, false],
                                    text: `VENCE:  ${moment(ticket.expiredDate).format('DD/MM/YYYY')}`,
                                    style: 'normalContent',
                                    margin: [0, -3],
                                },
                            ],
                            [
                                {
                                    colSpan: 2,
                                    border: [false, false, false, false],
                                    text: `${ticket.productName}`,
                                    style: 'normalContent',
                                    margin: [0, -3, 7],
                                },
                            ],
                        ],
                    },
                },
            ],
            [
                {
                    table: {
                        widths: [28.34, 56],
                        body: [
                            [
                                {
                                    rowSpan: 4,
                                    border: [false, false, false, false],
                                    image: ticket.qr64,
                                    width: 26,
                                    height: 26,
                                    alignment: 'center'
                                },
                                {
                                    border: [false, false, false, false],
                                    text: ` PROVEEDOR: ${ticket.providerCode}`,
                                    style: 'normalContent',
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
                                    text: `Lote.: ${ticket.lote}`,
                                    style: 'normalContent',
                                    margin: [0, -3],
                                },
                            ],
                            [
                                '',
                                {
                                    border: [false, false, false, false],
                                    text: `VENCE:  ${moment(ticket.expiredDate).format('DD/MM/YYYY')}`,
                                    style: 'normalContent',
                                    margin: [0, -3],
                                },
                            ],
                            [
                                {
                                    colSpan: 2,
                                    border: [false, false, false, false],
                                    text: `${ticket.productName}`,
                                    style: 'normalContent',
                                    margin: [0, -3, 7],
                                },
                            ],
                        ],
                    },
                },
            ],
            [
                {
                    table: {
                        widths: [28.34, 56],
                        body: [
                            [
                                {
                                    rowSpan: 4,
                                    border: [false, false, false, false],
                                    image: ticket.qr64,
                                    width: 26,
                                    height: 26,
                                    alignment: 'center'
                                },
                                {
                                    border: [false, false, false, false],
                                    text: ` PROVEEDOR: ${ticket.providerCode}`,
                                    style: 'normalContent',
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
                                    text: `Lote.: ${ticket.lote}`,
                                    style: 'normalContent',
                                    margin: [0, -3],
                                },
                            ],
                            [
                                '',
                                {
                                    border: [false, false, false, false],
                                    text: `VENCE:  ${moment(ticket.expiredDate).format('DD/MM/YYYY')}`,
                                    style: 'normalContent',
                                    margin: [0, -3],
                                },
                            ],
                            [
                                {
                                    colSpan: 2,
                                    border: [false, false, false, false],
                                    text: `${ticket.productName}`,
                                    style: 'normalContent',
                                    margin: [0, -3, 7],
                                },
                            ],
                        ],
                    },
                },
            ],
        ];

        let ticketsRows = [];

        for (let index = 0; index < rows; index++) {
            ticketsRows.push(ticketRow);
        }

        const cuerpoTickets = [{
            style: 'tableExample',
            table: {
                widths: [85.03, 85.03, 85.03],
                heights: [28.34, 28.34, 28.34],
                body:
                    ticketsRows
            },
            layout: 'noBorders',
        }];


        // const body = [{...cuerpoTickets}];


        this.printService.printTicket(cuerpoTickets);

    }


}
