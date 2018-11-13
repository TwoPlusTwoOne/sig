import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './product-in-purchase-order.reducer';
import { IProductInPurchaseOrder } from 'app/shared/model/product-in-purchase-order.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProductInPurchaseOrderDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class ProductInPurchaseOrderDetail extends React.Component<IProductInPurchaseOrderDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { productInPurchaseOrderEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            ProductInPurchaseOrder [<b>{productInPurchaseOrderEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="quantity">Quantity</span>
            </dt>
            <dd>{productInPurchaseOrderEntity.quantity}</dd>
            <dt>Locale</dt>
            <dd>{productInPurchaseOrderEntity.locale ? productInPurchaseOrderEntity.locale.id : ''}</dd>
            <dt>Purchase Order</dt>
            <dd>{productInPurchaseOrderEntity.purchaseOrder ? productInPurchaseOrderEntity.purchaseOrder.id : ''}</dd>
            <dt>Product</dt>
            <dd>{productInPurchaseOrderEntity.product ? productInPurchaseOrderEntity.product.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/product-in-purchase-order" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/product-in-purchase-order/${productInPurchaseOrderEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ productInPurchaseOrder }: IRootState) => ({
  productInPurchaseOrderEntity: productInPurchaseOrder.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductInPurchaseOrderDetail);
