import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ILocale, defaultValue } from 'app/shared/model/locale.model';

export const ACTION_TYPES = {
  FETCH_LOCALE_LIST: 'locale/FETCH_LOCALE_LIST',
  FETCH_LOCALE: 'locale/FETCH_LOCALE',
  CREATE_LOCALE: 'locale/CREATE_LOCALE',
  UPDATE_LOCALE: 'locale/UPDATE_LOCALE',
  DELETE_LOCALE: 'locale/DELETE_LOCALE',
  RESET: 'locale/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ILocale>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type LocaleState = Readonly<typeof initialState>;

// Reducer

export default (state: LocaleState = initialState, action): LocaleState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_LOCALE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_LOCALE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_LOCALE):
    case REQUEST(ACTION_TYPES.UPDATE_LOCALE):
    case REQUEST(ACTION_TYPES.DELETE_LOCALE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_LOCALE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_LOCALE):
    case FAILURE(ACTION_TYPES.CREATE_LOCALE):
    case FAILURE(ACTION_TYPES.UPDATE_LOCALE):
    case FAILURE(ACTION_TYPES.DELETE_LOCALE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_LOCALE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_LOCALE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_LOCALE):
    case SUCCESS(ACTION_TYPES.UPDATE_LOCALE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_LOCALE):
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

const apiUrl = 'api/locales';

// Actions

export const getEntities: ICrudGetAllAction<ILocale> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_LOCALE_LIST,
  payload: axios.get<ILocale>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ILocale> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_LOCALE,
    payload: axios.get<ILocale>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ILocale> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_LOCALE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ILocale> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_LOCALE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ILocale> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_LOCALE,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
