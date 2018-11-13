import { Moment } from 'moment';
import { IProductInPurchaseOrder } from 'app/shared/model//product-in-purchase-order.model';
import { IClient } from 'app/shared/model//client.model';

export const enum PurchaseOrderStatus {
  PendingApproval = 'PendingApproval',
  PendingRevision = 'PendingRevision',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Uploaded = 'Uploaded'
}

export interface IPurchaseOrder {
  id?: number;
  date?: Moment;
  revisionAttempts?: number;
  status?: PurchaseOrderStatus;
  products?: IProductInPurchaseOrder[];
  client?: IClient;
}

export const defaultValue: Readonly<IPurchaseOrder> = {};
