import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ILocale } from 'app/shared/model/locale.model';
import { getEntities as getLocales } from 'app/entities/locale/locale.reducer';
import { IPurchaseOrder } from 'app/shared/model/purchase-order.model';
import { getEntities as getPurchaseOrders } from 'app/entities/purchase-order/purchase-order.reducer';
import { IProduct } from 'app/shared/model/product.model';
import { getEntities as getProducts } from 'app/entities/product/product.reducer';
import { getEntity, updateEntity, createEntity, reset } from './product-in-purchase-order.reducer';
import { IProductInPurchaseOrder } from 'app/shared/model/product-in-purchase-order.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProductInPurchaseOrderUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IProductInPurchaseOrderUpdateState {
  isNew: boolean;
  localeId: string;
  purchaseOrderId: string;
  productId: string;
}

export class ProductInPurchaseOrderUpdate extends React.Component<IProductInPurchaseOrderUpdateProps, IProductInPurchaseOrderUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      localeId: '0',
      purchaseOrderId: '0',
      productId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getLocales();
    this.props.getPurchaseOrders();
    this.props.getProducts();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { productInPurchaseOrderEntity } = this.props;
      const entity = {
        ...productInPurchaseOrderEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/product-in-purchase-order');
  };

  render() {
    const { productInPurchaseOrderEntity, locales, purchaseOrders, products, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sigApp.productInPurchaseOrder.home.createOrEditLabel">Create or edit a ProductInPurchaseOrder</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : productInPurchaseOrderEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">ID</Label>
                    <AvInput id="product-in-purchase-order-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="quantityLabel" for="quantity">
                    Quantity
                  </Label>
                  <AvField id="product-in-purchase-order-quantity" type="string" className="form-control" name="quantity" />
                </AvGroup>
                <AvGroup>
                  <Label for="locale.id">Locale</Label>
                  <AvInput id="product-in-purchase-order-locale" type="select" className="form-control" name="locale.id">
                    <option value="" key="0" />
                    {locales
                      ? locales.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="purchaseOrder.id">Purchase Order</Label>
                  <AvInput id="product-in-purchase-order-purchaseOrder" type="select" className="form-control" name="purchaseOrder.id">
                    <option value="" key="0" />
                    {purchaseOrders
                      ? purchaseOrders.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="product.id">Product</Label>
                  <AvInput id="product-in-purchase-order-product" type="select" className="form-control" name="product.id">
                    <option value="" key="0" />
                    {products
                      ? products.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/product-in-purchase-order" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">Back</span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp; Save
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  locales: storeState.locale.entities,
  purchaseOrders: storeState.purchaseOrder.entities,
  products: storeState.product.entities,
  productInPurchaseOrderEntity: storeState.productInPurchaseOrder.entity,
  loading: storeState.productInPurchaseOrder.loading,
  updating: storeState.productInPurchaseOrder.updating,
  updateSuccess: storeState.productInPurchaseOrder.updateSuccess
});

const mapDispatchToProps = {
  getLocales,
  getPurchaseOrders,
  getProducts,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductInPurchaseOrderUpdate);
