import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Locale from './locale';
import LocaleDetail from './locale-detail';
import LocaleUpdate from './locale-update';
import LocaleDeleteDialog from './locale-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={LocaleUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={LocaleUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={LocaleDetail} />
      <ErrorBoundaryRoute path={match.url} component={Locale} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={LocaleDeleteDialog} />
  </>
);

export default Routes;
