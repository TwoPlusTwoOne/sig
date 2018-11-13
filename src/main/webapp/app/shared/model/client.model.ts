import { ILocale } from 'app/shared/model//locale.model';
import { IPurchaseOrder } from 'app/shared/model//purchase-order.model';

export interface IClient {
  id?: number;
  name?: string;
  locales?: ILocale[];
  purchaseOrders?: IPurchaseOrder[];
}

export const defaultValue: Readonly<IClient> = {};
