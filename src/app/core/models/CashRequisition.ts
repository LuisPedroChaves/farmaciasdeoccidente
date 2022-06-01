import { CashItem } from "./Cash";
import { CashFlowItem } from "./CashFlow";
import { CheckItem } from './Check';

export interface CashRequisitionItem {
    _id?: string,
    _cash: CashItem,
    _check?: CheckItem,
    _cashFlows: CashFlowItem[],
    total: number,
    paid: boolean,
    created?: string | Date,
    updated?: string,
}
