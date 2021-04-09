import { combineReducers, createStore } from 'redux';

import { authReducer } from './auth/';

import { store } from './store';

const referenceRootReducer = combineReducers({
  auth: authReducer,
});

const referenceStore = createStore(referenceRootReducer);

describe('store:', () => {
  it('should have a valid state shape', () => {
    expect(store.getState()).toEqual(referenceStore.getState());
  });
});
