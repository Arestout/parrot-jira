import { useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { IAuthState } from 'src/redux/auth';
import { RootStateType } from 'src/redux/rootReducer';

import * as authActions from '../redux/auth/auth.actions';
import * as types from '../redux/auth/auth.types';

interface ReturnType {
  auth: IAuthState;
  dispatchFetchRequestAuth: () => void;
  dispatchLogOut: () => void;
  dispatchFetchAuth: (session_id: string) => void;
  dispatchUpdateToken: (access_token: string) => void;
  dispatchUpdateUser: (user: any) => void;
  dispatchFetchAuthOnLogin: ({ email, password }: types.IUserAuth) => void;
  dispatchFetchTasks: (access_token: string) => void;
  dispatchFetchUserTasks: ({ access_token, userId }) => void;
}

export const useAuth = (): ReturnType => {
  const auth = useSelector<RootStateType, IAuthState>(
    (state: RootStateType) => state.auth,
    shallowEqual
  );

  const dispatch = useDispatch();

  const dispatchFetchRequestAuth = useCallback(
    () => dispatch(authActions.fetchRequestAuth()),
    [dispatch]
  );

  const dispatchUpdateUser = useCallback(
    (user: any) => dispatch(authActions.updateUser(user)),
    [dispatch]
  );

  const dispatchUpdateToken = useCallback(
    (access_token: string) => dispatch(authActions.updateToken(access_token)),
    [dispatch]
  );

  const dispatchLogOut = useCallback(() => dispatch(authActions.onLogOut()), [
    dispatch,
  ]);

  const dispatchFetchAuth = useCallback(
    (access_token: string) => {
      dispatch(authActions.fetchAuth(access_token));
    },
    [dispatch]
  );

  const dispatchFetchAuthOnLogin = useCallback(
    async ({ email, password }) => {
      dispatch(authActions.fetchAuthOnLogin({ email, password }));
    },
    [dispatch]
  );

  const dispatchFetchTasks = useCallback(
    (access_token: string) => dispatch(authActions.fetchTasks(access_token)),
    [dispatch]
  );

  const dispatchFetchUserTasks = useCallback(
    ({ access_token, userId }) =>
      dispatch(authActions.fetchUserTasks({ access_token, userId })),
    [dispatch]
  );

  return {
    auth,
    dispatchFetchRequestAuth,
    dispatchUpdateUser,
    dispatchUpdateToken,
    dispatchLogOut,
    dispatchFetchAuthOnLogin,
    dispatchFetchAuth,
    dispatchFetchTasks,
    dispatchFetchUserTasks,
  };
};
