import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITruck, defaultValue } from 'app/shared/model/truck.model';

export const ACTION_TYPES = {
  FETCH_TRUCK_LIST: 'truck/FETCH_TRUCK_LIST',
  FETCH_TRUCK: 'truck/FETCH_TRUCK',
  CREATE_TRUCK: 'truck/CREATE_TRUCK',
  UPDATE_TRUCK: 'truck/UPDATE_TRUCK',
  DELETE_TRUCK: 'truck/DELETE_TRUCK',
  RESET: 'truck/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITruck>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type TruckState = Readonly<typeof initialState>;

// Reducer

export default (state: TruckState = initialState, action): TruckState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TRUCK_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TRUCK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TRUCK):
    case REQUEST(ACTION_TYPES.UPDATE_TRUCK):
    case REQUEST(ACTION_TYPES.DELETE_TRUCK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TRUCK_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TRUCK):
    case FAILURE(ACTION_TYPES.CREATE_TRUCK):
    case FAILURE(ACTION_TYPES.UPDATE_TRUCK):
    case FAILURE(ACTION_TYPES.DELETE_TRUCK):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TRUCK_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_TRUCK):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TRUCK):
    case SUCCESS(ACTION_TYPES.UPDATE_TRUCK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TRUCK):
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

const apiUrl = 'api/trucks';

// Actions

export const getEntities: ICrudGetAllAction<ITruck> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_TRUCK_LIST,
  payload: axios.get<ITruck>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ITruck> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TRUCK,
    payload: axios.get<ITruck>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITruck> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TRUCK,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITruck> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TRUCK,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITruck> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TRUCK,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
