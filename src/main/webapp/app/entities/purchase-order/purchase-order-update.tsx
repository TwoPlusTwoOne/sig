import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IClient } from 'app/shared/model/client.model';
import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { getEntity, updateEntity, createEntity, reset } from './purchase-order.reducer';
import { IPurchaseOrder } from 'app/shared/model/purchase-order.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPurchaseOrderUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IPurchaseOrderUpdateState {
  isNew: boolean;
  clientId: string;
}

export class PurchaseOrderUpdate extends React.Component<IPurchaseOrderUpdateProps, IPurchaseOrderUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      clientId: '0',
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

    this.props.getClients();
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
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/purchase-order');
  };

  render() {
    const { purchaseOrderEntity, clients, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sigApp.purchaseOrder.home.createOrEditLabel">Create or edit a PurchaseOrder</h2>
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
                <AvGroup>
                  <Label id="dateLabel" for="date">
                    Date
                  </Label>
                  <AvField id="purchase-order-date" type="date" className="form-control" name="date" />
                </AvGroup>
                <AvGroup>
                  <Label id="revisionAttemptsLabel" for="revisionAttempts">
                    Revision Attempts
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
                <AvGroup>
                  <Label for="client.id">Client</Label>
                  <AvInput id="purchase-order-client" type="select" className="form-control" name="client.id">
                    <option value="" key="0" />
                    {clients
                      ? clients.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/purchase-order" replace color="info">
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
  clients: storeState.client.entities,
  purchaseOrderEntity: storeState.purchaseOrder.entity,
  loading: storeState.purchaseOrder.loading,
  updating: storeState.purchaseOrder.updating,
  updateSuccess: storeState.purchaseOrder.updateSuccess
});

const mapDispatchToProps = {
  getClients,
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
)(PurchaseOrderUpdate);
