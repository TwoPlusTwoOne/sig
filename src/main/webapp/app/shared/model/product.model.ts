import { IProductInPurchaseOrder } from 'app/shared/model//product-in-purchase-order.model';

export interface IProduct {
  id?: number;
  name?: string;
  weight?: number;
  stock?: number;
  unitsPerBox?: number;
  boxesPerPallet?: number;
  purchaseOrders?: IProductInPurchaseOrder[];
}

export const defaultValue: Readonly<IProduct> = {};
