import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './product-in-purchase-order.reducer';
import { IProductInPurchaseOrder } from 'app/shared/model/product-in-purchase-order.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProductInPurchaseOrderProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class ProductInPurchaseOrder extends React.Component<IProductInPurchaseOrderProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { productInPurchaseOrderList, match } = this.props;
    return (
      <div>
        <h2 id="product-in-purchase-order-heading">
          Product In Purchase Orders
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new Product In Purchase Order
          </Link>
        </h2>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Quantity</th>
                <th>Locale</th>
                <th>Purchase Order</th>
                <th>Product</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {productInPurchaseOrderList.map((productInPurchaseOrder, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${productInPurchaseOrder.id}`} color="link" size="sm">
                      {productInPurchaseOrder.id}
                    </Button>
                  </td>
                  <td>{productInPurchaseOrder.quantity}</td>
                  <td>
                    {productInPurchaseOrder.locale ? (
                      <Link to={`locale/${productInPurchaseOrder.locale.id}`}>{productInPurchaseOrder.locale.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    {productInPurchaseOrder.purchaseOrder ? (
                      <Link to={`purchase-order/${productInPurchaseOrder.purchaseOrder.id}`}>
                        {productInPurchaseOrder.purchaseOrder.id}
                      </Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    {productInPurchaseOrder.product ? (
                      <Link to={`product/${productInPurchaseOrder.product.id}`}>{productInPurchaseOrder.product.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${productInPurchaseOrder.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${productInPurchaseOrder.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${productInPurchaseOrder.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ productInPurchaseOrder }: IRootState) => ({
  productInPurchaseOrderList: productInPurchaseOrder.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductInPurchaseOrder);
