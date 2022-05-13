import { CellarItem } from './Cellar';
import { CustomerItem } from './Customer';
import { ProductItem } from './Product';
import { UserItem } from './User';

export interface OrderItem {
  _id?: string;
  _cellar: CellarItem;
  _customer?: CustomerItem;
  _delivery?: UserItem;
  _user: UserItem;
  _userDeleted?: UserItem;
  address: string;
  date: string;
  deleted?: boolean;
  department: string;
  detail: OrderDetailItem[];
  details: string;
  name: string;
  nit: string;
  noBill: string;
  noOrder: string;
  payment: string;
  phone: string;
  sellerCode?: string;
  state: string;
  textDeleted?: string;
  textReturned?: string;
  timeDelivery?: string;
  timeDispatch?: string;
  timeOrder: string;
  timeSend?: string;
  total: number;
  town: string;
}

export interface OrderDetailItem extends Document {
  _product: ProductItem;
  presentation: OrderDetailPresentationItem;
  price: number;
  quantity: number;
}
export interface OrderDetailPresentationItem extends Document {
  name: string;
  quantity: number;
}
