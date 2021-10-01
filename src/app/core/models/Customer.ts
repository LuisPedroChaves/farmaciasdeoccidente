import { UserItem } from './User';

export interface CustomerItem {
	_id?: string,
	name: string,
 	nit: string,
 	phone: string,
 	address: string,
 	town: string,
 	department: string,
	addresses?: CustomerAddressesItem[],
 	company: string,
 	code?: string,
 	transport: string,
 	limitCredit: number,
	 limitDaysCredit: number,
	 _seller?: UserItem,
}

export interface CustomerAddressesItem{
	address: string,
	town: string,
	department: string,
}
