import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './truck.reducer';
import { ITruck } from 'app/shared/model/truck.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITruckDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class TruckDetail extends React.Component<ITruckDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { truckEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            Truck [<b>{truckEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="maxPallets">Max Pallets</span>
            </dt>
            <dd>{truckEntity.maxPallets}</dd>
            <dt>
              <span id="maxWeight">Max Weight</span>
            </dt>
            <dd>{truckEntity.maxWeight}</dd>
          </dl>
          <Button tag={Link} to="/entity/truck" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/truck/${truckEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ truck }: IRootState) => ({
  truckEntity: truck.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TruckDetail);
