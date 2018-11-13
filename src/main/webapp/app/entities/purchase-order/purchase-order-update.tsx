import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row, Table } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { createEntity, getEntity, reset, updateEntity } from './purchase-order.reducer';
import { getEntities as getProducts } from 'app/entities/product/product.reducer';
import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { getEntities as getLocales } from 'app/entities/locale/locale.reducer';
import {
  getEntities as getProductsInPurchaseOrder,
  deleteEntity as deleteProductsInPurchaseOrder
} from 'app/entities/product-in-purchase-order/product-in-purchase-order.reducer';
import { IProduct } from 'app/shared/model/product.model';
import { IProductInPurchaseOrder } from 'app/shared/model/product-in-purchase-order.model';
import { ILocale } from 'app/shared/model/locale.model';

export interface IPurchaseOrderUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IPurchaseOrderUpdateState {
  isNew: boolean;
  products: IProductInPurchaseOrder[];
  clientId: string;
  deletedProducts: string[];
}

interface IAddProductRowProps {
  products: ReadonlyArray<IProduct>;
  locales: ILocale[];
  onSubmit: (item: IProductInPurchaseOrder) => any;
}

interface IAddProductRowState {
  fields: {
    product: IProduct;
    quantity: number;
    locale: string;
  };
}

class AddProductRow extends Component<IAddProductRowProps, IAddProductRowState> {
  state: IAddProductRowState = {
    fields: {
      product: null,
      quantity: 0,
      locale: null
    }
  };

  handleChange = (field: string, value: number | IProduct | ILocale) => {
    this.setState({ ...this.state, fields: { ...this.state.fields, [field]: value } });
  };

  handleSubmit = () => {
    const { locale, product, quantity } = this.state.fields;

    this.props.onSubmit({ locale: this.props.locales.find(l => l.id.toString() === locale), product, quantity });
  };

  render() {
    return (
      <Row form className={'align-items-start'}>
        <Col md={'3'}>
          <AvGroup>
            <Label id="revisionAttemptsLabel" for="new-product-name">
              Producto
            </Label>
            <AvField
              id="new-product-name"
              type="select"
              className="form-control"
              name="new-product-name"
              onChange={event =>
                this.handleChange('product', this.props.products.find(product => product.id.toString() === event.target.value))
              }
            >
              <option value={null} />
              {this.props.products.map(product => (
                <option value={product.id}>
                  [{product.id}] {product.name}
                </option>
              ))}
            </AvField>
          </AvGroup>
        </Col>
        <Col md={'3'}>
          <AvGroup>
            <Label id="revisionAttemptsLabel" for="new-product-quantity">
              Cantidad
            </Label>
            <AvField
              id="new-product-quantity"
              type="number"
              className="form-control"
              name="new-product-quantity"
              onChange={event => this.handleChange('quantity', event.target.value)}
            />
          </AvGroup>
        </Col>
        <Col md={'3'}>
          <AvGroup>
            <Label id="newProductLocaleLabel" for="new-product-locale">
              Local
            </Label>
            <AvField
              id="new-product-locale"
              type="select"
              className="form-control"
              name="new-product-locale"
              onChange={event => this.handleChange('locale', event.target.value)}
            >
              <option value={'0'} />
              {this.props.locales.map(locale => (
                <option value={locale.id} key={locale.id}>
                  [{locale.id}] {locale.name}
                </option>
              ))}
            </AvField>
          </AvGroup>
        </Col>
        <Col md={'3'}>
          <Button name={'button'} onClick={this.handleSubmit} id={'add-product'} color="primary" style={{ marginTop: '32px' }}>
            Agregar
          </Button>
        </Col>
      </Row>
    );
  }
}

export class PurchaseOrderUpdate extends React.Component<IPurchaseOrderUpdateProps, IPurchaseOrderUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id,
      products: [],
      clientId: '0',
      deletedProducts: []
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.productsInPurchaseOrder !== this.props.productsInPurchaseOrder) {
      const productsInThisPurchaseOrder = this.props.productsInPurchaseOrder.filter(
        p => p.purchaseOrder.id === this.props.purchaseOrderEntity.id
      );
      this.setState({ products: this.state.products.concat(productsInThisPurchaseOrder) });
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
    this.props.getLocales();
    this.props.getProductsInPurchaseOrder();
  }

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
        this.props.updateEntity({ ...entity, products: this.state.products });
        this.state.deletedProducts.forEach(dp => this.props.deleteProductsInPurchaseOrder(dp));
      }
    }
  };

  addProduct = (product: IProductInPurchaseOrder) => {
    const products = this.state.products.concat([product]);
    this.setState({ products });
  };

  handleClose = () => {
    this.props.history.push('/entity/purchase-order');
  };

  handleRemoveRow = (index: number) => {
    const productsCopy = [...this.state.products];
    const removed = productsCopy.splice(index, 1);
    this.setState({
      products: productsCopy,
      deletedProducts: [...this.state.deletedProducts.concat([removed[0].id.toString()])]
    });
  };

  toCSV = () => {
    const items: IProductInPurchaseOrder[] = this.state.products;

    const getResultForColumn = (fieldName: string, row: IProductInPurchaseOrder) => {
      if (fieldName === 'locale') return `[${row.locale.id}] ${row.locale.name}`;
      if (fieldName === 'product') return `[${row.product.id}] ${row.product.name}`;
      return row[fieldName];
    };

    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(items[0]).filter(key => key !== 'purchaseOrder');
    let csv = items.map(row => {
      return header.map(fieldName => JSON.stringify(getResultForColumn(fieldName, row), replacer)).join(',');
    });
    csv.unshift(header.join(','));
    const csvString = csv.join('\r\n');

    console.log(csvString);
  };

  render() {
    const { purchaseOrderEntity, loading, updating, allProducts = [], clients, locales = [] } = this.props;
    const { isNew, products = [] } = this.state;

    const clientLocales = purchaseOrderEntity.client ? locales.filter(locale => locale.client.id === purchaseOrderEntity.client.id) : [];

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
                    <option value="Uploaded">Uploaded</option>
                  </AvInput>
                </AvGroup>
                <div>
                  <Label>Productos</Label>
                  <Table>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                      <th>Local</th>
                      <th />
                    </tr>
                    {products.map((product: IProductInPurchaseOrder, i: number) => (
                      <tr key={product.id}>
                        <td>{product.product.id}</td>
                        <td>{product.product.name}</td>
                        <td>{product.quantity}</td>
                        <td>
                          [{product.locale.id}] {product.locale.name}
                        </td>
                        <td>
                          <Button id="jhi-confirm-delete-purchaseOrder" color="danger" onClick={() => this.handleRemoveRow(i)}>
                            <FontAwesomeIcon icon="trash" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </Table>
                </div>
                <AddProductRow onSubmit={this.addProduct} products={allProducts} locales={clientLocales} />
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
  clients: storeState.client.entities,
  locales: storeState.locale.entities,
  productsInPurchaseOrder: storeState.productInPurchaseOrder.entities
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getProducts,
  getClients,
  getLocales,
  getProductsInPurchaseOrder,
  deleteProductsInPurchaseOrder
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseOrderUpdate);
