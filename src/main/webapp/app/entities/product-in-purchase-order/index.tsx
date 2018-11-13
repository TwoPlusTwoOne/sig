import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProductInPurchaseOrder from './product-in-purchase-order';
import ProductInPurchaseOrderDetail from './product-in-purchase-order-detail';
import ProductInPurchaseOrderUpdate from './product-in-purchase-order-update';
import ProductInPurchaseOrderDeleteDialog from './product-in-purchase-order-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProductInPurchaseOrderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProductInPurchaseOrderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProductInPurchaseOrderDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProductInPurchaseOrder} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={ProductInPurchaseOrderDeleteDialog} />
  </>
);

export default Routes;
