import React from 'react';
import { Switch } from 'react-router-dom';

// tslint:disable-next-line:no-unused-variable
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import PurchaseOrder from './purchase-order';
import Client from './client';
import Locale from './locale';
import Product from './product';
import Truck from './truck';
import ProductInPurchaseOrder from './product-in-purchase-order';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/purchase-order`} component={PurchaseOrder} />
      <ErrorBoundaryRoute path={`${match.url}/client`} component={Client} />
      <ErrorBoundaryRoute path={`${match.url}/locale`} component={Locale} />
      <ErrorBoundaryRoute path={`${match.url}/product`} component={Product} />
      <ErrorBoundaryRoute path={`${match.url}/truck`} component={Truck} />
      <ErrorBoundaryRoute path={`${match.url}/product-in-purchase-order`} component={ProductInPurchaseOrder} />
      {/* jhipster-needle-add-route-path - JHipster will routes here */}
    </Switch>
  </div>
);

export default Routes;
