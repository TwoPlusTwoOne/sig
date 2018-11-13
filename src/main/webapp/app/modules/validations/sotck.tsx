import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
// import { getEntities } from './purchase-order.reducer';
import { IPurchaseOrder } from 'app/shared/model/purchase-order.model';
import { getEntities as getProducts } from 'app/entities/product/product.reducer';
import { getEntity as getPurchaseOrder } from 'app/entities/purchase-order/purchase-order.reducer';
import { getEntities as getProductInPurchaseOrder } from 'app/entities/product-in-purchase-order/product-in-purchase-order.reducer';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { IProductInPurchaseOrder } from 'app/shared/model/product-in-purchase-order.model';

// export interface IPurchaseOrderProps extends RouteComponentProps<{ url: string }> {}

interface IStockValidationProps extends StateProps, DispatchProps, RouteComponentProps<{ purchaseOrder: string }> {}

export class StockValidation extends React.Component<IStockValidationProps> {
  state = {
    modal: false
  };

  componentDidMount() {
    this.props.getProducts();
    this.props.getPurchaseOrder(this.props.match.params.purchaseOrder);
    this.props.getProductInPurchaseOrder();
  }

  render() {
    // const { purchaseOrderList, match } = this.props;

    const validItemStock = (i: IProductInPurchaseOrder) => i.quantity <= this.props.products.find(p => p.id === i.product.id).stock;

    const passValidation = () => {
      const products = this.props.productInPurchaseOrder.filter(p => p.purchaseOrder.id === this.props.purchaseOrder.id);
      return products.filter(p => validItemStock(p)).length > 0;
    };

    const validationResult = () => {
      if (passValidation()) {
        return 'Exitosa';
      } else {
        return 'Fallida';
      }
    };

    const formButton = () => {
      if (passValidation()) {
        return (
          <div>
            <Button
              className="float-left"
              tag={Link}
              to={`/entity/purchase-order/${this.props.purchaseOrder.id}/edit`}
              color="info"
              size="sm"
            >
              <FontAwesomeIcon icon="check-square" /> <span className="d-none d-md-inline">Modificar</span>
            </Button>
            <Button className="float-right" tag={Link} to={`/validateVolume/${this.props.purchaseOrder.id}`} color="info" size="sm">
              <FontAwesomeIcon icon="check-square" /> <span className="d-none d-md-inline">Siguiente</span>
            </Button>
          </div>
        );
      } else {
        return (
          <Button
            className="float-right"
            tag={Link}
            to={`/entity/purchase-order/${this.props.purchaseOrder.id}/edit`}
            color="info"
            size="sm"
          >
            <FontAwesomeIcon icon="check-square" /> <span className="d-none d-md-inline">Modificar</span>
          </Button>
        );
      }
    };

    const showModal = () => {
      return this.props.purchaseOrder.revisionAttempts >= 4;
    };
    return (
      <div>
        <Modal isOpen={showModal}>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>La orden de compra supero el numero máximo de correcciones</ModalBody>
          <ModalFooter>
            <Button color="alert" tag={Link} to={`/`}>
              Continuar
            </Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col>
            <h2 id="purchase-order-heading">Validación de disponibilidad</h2>
          </Col>
        </Row>
        <Row>
          <Col xs="5" />
          <Col xs="2">
            <div>
              <h4 className="text-center">Validacion: {validationResult()}</h4>
            </div>
          </Col>
          <Col xs="5" />
        </Row>
        <Row>
          <Col>{formButton()}</Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  products: storeState.product.entities,
  purchaseOrder: storeState.purchaseOrder.entity,
  productInPurchaseOrder: storeState.productInPurchaseOrder.entities
});

const mapDispatchToProps = {
  getProducts,
  getPurchaseOrder,
  getProductInPurchaseOrder
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StockValidation);
