import { UserItem } from './User';

export interface CustomerItem {
	_id?: string,
	name: string,
 	nit: string,
 	phone: string,
 	address: string,
 	town: string,
 	department: string,
 	company: string,
 	transport: string,
 	limitCredit: number,
	 limitDaysCredit: number,
	 _seller?: UserItem,
}
