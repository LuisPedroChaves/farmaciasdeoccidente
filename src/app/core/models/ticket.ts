export interface ITicket {
    providerCode: string;
    productCode: string;
    productName: string;
    lote: string;
    expiredDate: Date;
    qr64: string;
}
