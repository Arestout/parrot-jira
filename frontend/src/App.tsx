import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Header } from './components/Header';
import { CssBaseline, Container } from '@material-ui/core';

import { SignUp } from './components/SignUp';
import { SignIn } from './components/SignIn';
import { MyTasks } from './components/MyTasks/MyTasks';
import { useAuth } from './hooks/useAuth';
import { TasksDashboard } from './pages/tasks-dashboard/TasksDashboard';

export const App: React.FC = () => {
  const { auth, dispatchFetchAuth } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (auth.access_token) {
      dispatchFetchAuth(auth.access_token);
    }
  }, [auth.access_token, dispatchFetchAuth]);

  if (auth.error === 'Invalid authentication token') {
    window.localStorage.removeItem('access_token');
    history.push('/sign-in');
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        {auth.isAuth || !auth.access_token ? (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Router>
              <Header />
              <Switch>
                <Route path="/" exact component={TasksDashboard} />
                <Route path="/sign-up" component={SignUp} />
                <Route path="/sign-in" component={SignIn} />
                <Route path="/my-tasks" component={MyTasks} />
              </Switch>
            </Router>
          </ErrorBoundary>
        ) : (
          <p>Loading</p>
        )}
      </Container>
    </React.Fragment>
  );
};

function ErrorFallback({ error }: FallbackProps) {
  return (
    <div className="error-fallback-wrapper">
      <div className="error-fallback" role="alert">
        <p>Something went wrong:</p>
        <p>{error.message}</p>
        <p>Please refresh the page and try again.</p>
      </div>
    </div>
  );
}
