import * as types from './auth.types';

const token = window.localStorage.getItem('access_token');

export interface IAuthState {
  user: null | types.IUser;
  access_token: string;
  isLoading: boolean;
  isAuth: boolean;
  tasks: any;
  userTasks: any;
  error: string;
}

const initialState: IAuthState = {
  user: null,
  access_token: token || '',
  isLoading: false,
  isAuth: false,
  tasks: [],
  userTasks: [],
  error: '',
};

export const authReducer = (
  state = initialState,
  action: types.AuthActionTypes
): IAuthState => {
  switch (action.type) {
    case types.FETCH_REQUEST_AUTH:
      return {
        ...state,
        isLoading: true,
      };
    case types.FETCH_SUCCESS_TOKEN:
      return {
        ...state,
        access_token: action.payload,
        error: '',
      };
    case types.FETCH_SUCCESS_AUTH:
      return {
        ...state,
        user: action.payload,
        isAuth: true,
        error: '',
      };
    case types.LOGOUT:
      return {
        ...initialState,
      };
    case types.UPDATE_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };
    case types.UPDATE_USER_TASKS:
      return {
        ...state,
        userTasks: action.payload,
      };
    case types.FETCH_ERROR_AUTH:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
