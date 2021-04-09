export interface IUser {
  id: string;
  public_id: string;
  fullName: string;
  email: string;
  role: string;
  slack: string;
  mobile: string;
}

export interface IUserAuth {
  email: string;
  password: string;
}

export interface ITask {
  id: string;
  description: string;
  completed: boolean;
  developerId: null | string;
}

export const LOGOUT = 'LOGOUT';
export type LogoutAction = {
  type: typeof LOGOUT;
};

export const FETCH_REQUEST_AUTH = 'FETCH_REQUEST_AUTH';
export type FetchRequestAuthAction = {
  type: typeof FETCH_REQUEST_AUTH;
};

export const FETCH_SUCCESS_AUTH = 'FETCH_SUCCESS_AUTH';
export type FetchSuccessAuthAction = {
  type: typeof FETCH_SUCCESS_AUTH;
  payload: IUser;
};

export const FETCH_SUCCESS_TOKEN = 'FETCH_SUCCESS_TOKEN';
export type FetchSuccessToken = {
  type: typeof FETCH_SUCCESS_TOKEN;
  payload: string;
};

export const FETCH_ERROR_AUTH = 'FETCH_ERROR_AUTH';
export type FetchErrorAuthAction = {
  type: typeof FETCH_ERROR_AUTH;
  payload: string;
};

export const UPDATE_TASKS = 'UPDATE_TASKS';
export type UpdateTasks = {
  type: typeof UPDATE_TASKS;
  payload: ITask[];
};

export const UPDATE_USER_TASKS = 'UPDATE_USER_TASKS';
export type UpdateUserTasks = {
  type: typeof UPDATE_USER_TASKS;
  payload: ITask[];
};

export type AuthActionTypes =
  | LogoutAction
  | FetchRequestAuthAction
  | FetchSuccessAuthAction
  | FetchSuccessToken
  | FetchErrorAuthAction
  | UpdateTasks
  | UpdateUserTasks;
