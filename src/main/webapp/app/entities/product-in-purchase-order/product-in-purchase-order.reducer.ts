import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProductInPurchaseOrder, defaultValue } from 'app/shared/model/product-in-purchase-order.model';

export const ACTION_TYPES = {
  FETCH_PRODUCTINPURCHASEORDER_LIST: 'productInPurchaseOrder/FETCH_PRODUCTINPURCHASEORDER_LIST',
  FETCH_PRODUCTINPURCHASEORDER: 'productInPurchaseOrder/FETCH_PRODUCTINPURCHASEORDER',
  CREATE_PRODUCTINPURCHASEORDER: 'productInPurchaseOrder/CREATE_PRODUCTINPURCHASEORDER',
  UPDATE_PRODUCTINPURCHASEORDER: 'productInPurchaseOrder/UPDATE_PRODUCTINPURCHASEORDER',
  DELETE_PRODUCTINPURCHASEORDER: 'productInPurchaseOrder/DELETE_PRODUCTINPURCHASEORDER',
  RESET: 'productInPurchaseOrder/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProductInPurchaseOrder>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type ProductInPurchaseOrderState = Readonly<typeof initialState>;

// Reducer

export default (state: ProductInPurchaseOrderState = initialState, action): ProductInPurchaseOrderState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PRODUCTINPURCHASEORDER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PRODUCTINPURCHASEORDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_PRODUCTINPURCHASEORDER):
    case REQUEST(ACTION_TYPES.UPDATE_PRODUCTINPURCHASEORDER):
    case REQUEST(ACTION_TYPES.DELETE_PRODUCTINPURCHASEORDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_PRODUCTINPURCHASEORDER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PRODUCTINPURCHASEORDER):
    case FAILURE(ACTION_TYPES.CREATE_PRODUCTINPURCHASEORDER):
    case FAILURE(ACTION_TYPES.UPDATE_PRODUCTINPURCHASEORDER):
    case FAILURE(ACTION_TYPES.DELETE_PRODUCTINPURCHASEORDER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_PRODUCTINPURCHASEORDER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_PRODUCTINPURCHASEORDER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_PRODUCTINPURCHASEORDER):
    case SUCCESS(ACTION_TYPES.UPDATE_PRODUCTINPURCHASEORDER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_PRODUCTINPURCHASEORDER):
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

const apiUrl = 'api/product-in-purchase-orders';

// Actions

export const getEntities: ICrudGetAllAction<IProductInPurchaseOrder> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_PRODUCTINPURCHASEORDER_LIST,
  payload: axios.get<IProductInPurchaseOrder>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IProductInPurchaseOrder> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PRODUCTINPURCHASEORDER,
    payload: axios.get<IProductInPurchaseOrder>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IProductInPurchaseOrder> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PRODUCTINPURCHASEORDER,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProductInPurchaseOrder> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PRODUCTINPURCHASEORDER,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProductInPurchaseOrder> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PRODUCTINPURCHASEORDER,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
