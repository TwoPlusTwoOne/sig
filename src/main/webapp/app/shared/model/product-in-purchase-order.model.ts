import { ILocale } from 'app/shared/model//locale.model';
import { IPurchaseOrder } from 'app/shared/model//purchase-order.model';
import { IProduct } from 'app/shared/model//product.model';

export interface IProductInPurchaseOrder {
  id?: number;
  quantity?: number;
  locale?: ILocale;
  purchaseOrder?: IPurchaseOrder;
  product?: IProduct;
}

export const defaultValue: Readonly<IProductInPurchaseOrder> = {};
