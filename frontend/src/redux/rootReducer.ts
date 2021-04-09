import { combineReducers } from 'redux';

import { authReducer } from './auth';

export const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootStateType = ReturnType<typeof rootReducer>;
