import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './purchase-order.reducer';
import { IPurchaseOrder, PurchaseOrderStatus } from 'app/shared/model/purchase-order.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { hasAnyAuthority } from 'app/shared/auth/private-route';

export interface IPurchaseOrderDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class PurchaseOrderDetail extends React.Component<IPurchaseOrderDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { purchaseOrderEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            PurchaseOrder [<b>{purchaseOrderEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="date">Date</span>
            </dt>
            <dd>
              <TextFormat value={purchaseOrderEntity.date} type="date" format={APP_LOCAL_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="revisionAttempts">Revision Attempts</span>
            </dt>
            <dd>{purchaseOrderEntity.revisionAttempts}</dd>
            <dt>
              <span id="status">Status</span>
            </dt>
            <dd>{purchaseOrderEntity.status}</dd>
            <dt>Client</dt>
            <dd>{purchaseOrderEntity.client ? purchaseOrderEntity.client.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/purchase-order" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          {(this.props.isAdmin ||
            (purchaseOrderEntity.status === PurchaseOrderStatus.PendingApproval ||
              purchaseOrderEntity.status === PurchaseOrderStatus.Approved)) && (
            <Button tag={Link} to={`/entity/purchase-order/${purchaseOrderEntity.id}/edit`} replace color="primary">
              <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
            </Button>
          )}
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ purchaseOrder, authentication }: IRootState) => ({
  purchaseOrderEntity: purchaseOrder.entity,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN])
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseOrderDetail);
