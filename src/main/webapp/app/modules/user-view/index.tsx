import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PurchaseOrder from 'app/entities/purchase-order/purchase-order';
import PurchaseOrderUpdate from 'app/entities/purchase-order/purchase-order-update';
import PurchaseOrderDetail from 'app/entities/purchase-order/purchase-order-detail';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PurchaseOrderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PurchaseOrderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PurchaseOrderDetail} />
      <ErrorBoundaryRoute path={match.url} component={PurchaseOrder} />
    </Switch>
    {/*<ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={PurchaseOrderDeleteDialog} />*/}
  </>
);

export default Routes;
