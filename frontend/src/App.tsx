import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Header } from './components/Header';
import { CssBaseline, Container } from '@material-ui/core';

import { TaskTracker } from './components/TaskTracker';

export const App: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Router>
            <Header />
            <Switch>
              <Route path="/" exact component={TaskTracker} />
            </Switch>
          </Router>
        </ErrorBoundary>
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
