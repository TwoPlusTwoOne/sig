import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row, Table } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IClient } from 'app/shared/model/client.model';
import { createEntity, getEntity, reset, updateEntity } from './purchase-order.reducer';
// tslint:disable-next-line:no-unused-variable
import { getEntities as getProducts } from 'app/entities/product/product.reducer';
import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { IProduct } from 'app/shared/model/product.model';
import { IProductInPurchaseOrder } from 'app/shared/model/product-in-purchase-order.model';
import { IPurchaseOrder } from 'app/shared/model/purchase-order.model';
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPurchaseOrderUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IPurchaseOrderUpdateState {
  isNew: boolean;
  products: IProductInPurchaseOrder[];
  selectedNewProduct: IProduct;
  newProductQuantity: number;
  clientId: string;
}

export class PurchaseOrderUpdate extends React.Component<IPurchaseOrderUpdateProps, IPurchaseOrderUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id,
      products: this.props.purchaseOrderEntity.products || [],
      selectedNewProduct: null,
      newProductQuantity: 0,
      clientId: '0'
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
    this.props.getProducts();
    this.props.getClients();
    this.mapPurchaseOrderProductsToState();
  }

  mapPurchaseOrderProductsToState = () => {
    this.setState({ products: this.props.purchaseOrderEntity.products || [] });
  };

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { purchaseOrderEntity } = this.props;
      const entity = {
        ...purchaseOrderEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  addProduct = () => {
    const { selectedNewProduct, newProductQuantity } = this.state;
    if (!selectedNewProduct || !newProductQuantity) return;
    const newProduct: IProductInPurchaseOrder = { product: selectedNewProduct, quantity: newProductQuantity };
    const products = this.state.products.concat([newProduct]);
    this.setState({ products });
  };

  changeSelectedNewProduct = event => {
    const value = event.target.value;
    const selectedNewProduct = this.props.allProducts.find(product => product.id.toString() === value);
    this.setState({ selectedNewProduct });
  };

  changeNewProductQuantity = event => {
    const newProductQuantity = event.target.value;
    this.setState({ newProductQuantity });
  };

  handleClose = () => {
    this.props.history.push('/entity/purchase-order');
  };

  render() {
    const { purchaseOrderEntity, loading, updating, allProducts = [], clients } = this.props;
    const { isNew, products = [] } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sigApp.purchaseOrder.home.createOrEditLabel">{isNew ? 'Crear' : 'Modificar'} órden de compra</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : purchaseOrderEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">ID</Label>
                    <AvInput id="purchase-order-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                {/* <AvGroup>
                  <Label id="clientLabel" for="client">
                    Cliente
                  </Label>
                  <AvField id="purchase-order-client" type="select" className="form-control" name="client">
                    {clients.map(client => (
                      <option value={client.id}>{client.name}</option>
                    ))}
                  </AvField>
                </AvGroup>*/}
                <AvGroup>
                  <Label for="client.id">Cliente</Label>
                  <AvInput id="purchase-order-client" type="select" className="form-control" name="client.id">
                    <option value="" key="0" />
                    {clients
                      ? clients.map(client => (
                          <option value={client.id} key={client.id}>
                            [{client.id}] {client.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="dateLabel" for="date">
                    Fecha de entrega
                  </Label>
                  <AvField id="purchase-order-date" type="date" className="form-control" name="date" />
                </AvGroup>
                <AvGroup>
                  <Label id="revisionAttemptsLabel" for="revisionAttempts">
                    Revisiones
                  </Label>
                  <AvField id="purchase-order-revisionAttempts" type="string" className="form-control" name="revisionAttempts" />
                </AvGroup>
                <AvGroup>
                  <Label id="statusLabel">Status</Label>
                  <AvInput
                    id="purchase-order-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && purchaseOrderEntity.status) || 'PendingApproval'}
                  >
                    <option value="PendingApproval">PendingApproval</option>
                    <option value="PendingRevision">PendingRevision</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </AvInput>
                </AvGroup>
                <div>
                  <Label>Productos</Label>
                  <Table>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                    </tr>
                    {products.map((product: IProductInPurchaseOrder) => (
                      <tr>
                        <td>{product.product.id}</td>
                        <td>{product.product.name}</td>
                        <td>{product.quantity}</td>
                      </tr>
                    ))}
                  </Table>
                </div>
                <Row form className={'align-items-start'}>
                  <Col md={'4'}>
                    <AvGroup>
                      <Label id="revisionAttemptsLabel" for="new-product-name">
                        Producto
                      </Label>
                      <AvField
                        id="new-product-name"
                        type="select"
                        className="form-control"
                        name="new-product-name"
                        onChange={this.changeSelectedNewProduct}
                      >
                        <option value={null} />
                        {allProducts.map(product => (
                          <option value={product.id}>{product.name}</option>
                        ))}
                      </AvField>
                    </AvGroup>
                  </Col>
                  <Col md={'4'}>
                    <AvGroup>
                      <Label id="revisionAttemptsLabel" for="new-product-quantity">
                        Cantidad
                      </Label>
                      <AvField
                        id="new-product-quantity"
                        type="number"
                        className="form-control"
                        name="new-product-quantity"
                        onChange={this.changeNewProductQuantity}
                      />
                    </AvGroup>
                  </Col>
                  <Col md={'4'}>
                    <Button name={'button'} onClick={this.addProduct} id={'add-product'} color="primary" style={{ marginTop: '32px' }}>
                      Agregar
                    </Button>
                  </Col>
                </Row>
                <Button tag={Link} id="cancel-save" to="/entity/purchase-order" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">Volver</span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp; Guardar
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
  purchaseOrderEntity: storeState.purchaseOrder.entity,
  loading: storeState.purchaseOrder.loading,
  updating: storeState.purchaseOrder.updating,
  updateSuccess: storeState.purchaseOrder.updateSuccess,
  allProducts: storeState.product.entities,
  clients: storeState.client.entities
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getProducts,
  getClients
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseOrderUpdate);
