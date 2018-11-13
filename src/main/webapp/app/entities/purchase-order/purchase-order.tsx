import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './purchase-order.reducer';
import { IPurchaseOrder, PurchaseOrderStatus } from 'app/shared/model/purchase-order.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { hasAnyAuthority } from 'app/shared/auth/private-route';

export interface IPurchaseOrderProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class PurchaseOrder extends React.Component<IPurchaseOrderProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { purchaseOrderList, match } = this.props;

    return (
      <div>
        <h2 id="purchase-order-heading">
          Órdenes de compra
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Crear una nueva órden de compra
          </Link>
        </h2>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha de entrega</th>
                <th>Revisiones realizadas</th>
                <th>Status</th>
                <th>Client</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {purchaseOrderList.map((purchaseOrder, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${purchaseOrder.id}`} color="link" size="sm">
                      {purchaseOrder.id}
                    </Button>
                  </td>
                  <td>
                    {purchaseOrder.date ? (
                      <TextFormat type="date" value={purchaseOrder.date} format={APP_LOCAL_DATE_FORMAT} />
                    ) : (
                      'No establecido todavía'
                    )}
                  </td>
                  <td>{purchaseOrder.revisionAttempts}</td>
                  <td>{purchaseOrder.status}</td>
                  <td>{purchaseOrder.client ? `[${purchaseOrder.client.id}] ${purchaseOrder.client.name}` : ''}</td>
                  <td className="text-right">
                    <Button tag={Link} to={`/validateStock/${purchaseOrder.id}`} color="info" size="sm">
                      <FontAwesomeIcon icon="check-square" /> <span className="d-none d-md-inline">Validar</span>
                    </Button>
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${purchaseOrder.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Ver detalle</span>
                      </Button>
                      {(this.props.isAdmin ||
                        (purchaseOrder.status === PurchaseOrderStatus.PendingApproval ||
                          purchaseOrder.status === PurchaseOrderStatus.Approved)) && (
                        <span>
                          <Button tag={Link} to={`${match.url}/${purchaseOrder.id}/edit`} color="primary" size="sm">
                            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Modificar</span>
                          </Button>
                          <Button tag={Link} to={`${match.url}/${purchaseOrder.id}/delete`} color="danger" size="sm">
                            <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Borrar</span>
                          </Button>
                        </span>
                      )}
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

const mapStateToProps = ({ purchaseOrder, authentication }: IRootState) => ({
  purchaseOrderList: purchaseOrder.entities,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN])
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseOrder);
