import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { createEntity as createProductInPurchaseOrder } from 'app/entities/product-in-purchase-order/product-in-purchase-order.reducer';

import { IPurchaseOrder, defaultValue } from 'app/shared/model/purchase-order.model';
import { IProductInPurchaseOrder } from 'app/shared/model/product-in-purchase-order.model';

export const ACTION_TYPES = {
  FETCH_PURCHASEORDER_LIST: 'purchaseOrder/FETCH_PURCHASEORDER_LIST',
  FETCH_PURCHASEORDER: 'purchaseOrder/FETCH_PURCHASEORDER',
  CREATE_PURCHASEORDER: 'purchaseOrder/CREATE_PURCHASEORDER',
  UPDATE_PURCHASEORDER: 'purchaseOrder/UPDATE_PURCHASEORDER',
  DELETE_PURCHASEORDER: 'purchaseOrder/DELETE_PURCHASEORDER',
  RESET: 'purchaseOrder/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPurchaseOrder>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type PurchaseOrderState = Readonly<typeof initialState>;

// Reducer

export default (state: PurchaseOrderState = initialState, action): PurchaseOrderState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PURCHASEORDER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PURCHASEORDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_PURCHASEORDER):
    case REQUEST(ACTION_TYPES.UPDATE_PURCHASEORDER):
    case REQUEST(ACTION_TYPES.DELETE_PURCHASEORDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_PURCHASEORDER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PURCHASEORDER):
    case FAILURE(ACTION_TYPES.CREATE_PURCHASEORDER):
    case FAILURE(ACTION_TYPES.UPDATE_PURCHASEORDER):
    case FAILURE(ACTION_TYPES.DELETE_PURCHASEORDER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_PURCHASEORDER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_PURCHASEORDER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_PURCHASEORDER):
    case SUCCESS(ACTION_TYPES.UPDATE_PURCHASEORDER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_PURCHASEORDER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/purchase-orders';

// Actions

export const getEntities: ICrudGetAllAction<IPurchaseOrder> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_PURCHASEORDER_LIST,
  payload: axios.get<IPurchaseOrder>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IPurchaseOrder> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PURCHASEORDER,
    payload: axios.get<IPurchaseOrder>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IPurchaseOrder> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PURCHASEORDER,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPurchaseOrder> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PURCHASEORDER,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });

  entity.products.forEach(product => {
    if (!product.id) {
      const a: IProductInPurchaseOrder = { ...product, purchaseOrder: { id: entity.id } };
      dispatch(createProductInPurchaseOrder(a));
    }
  });

  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPurchaseOrder> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PURCHASEORDER,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
