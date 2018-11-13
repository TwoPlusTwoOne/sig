import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './locale.reducer';
import { ILocale } from 'app/shared/model/locale.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ILocaleDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class LocaleDetail extends React.Component<ILocaleDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { localeEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            Locale [<b>{localeEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">Name</span>
            </dt>
            <dd>{localeEntity.name}</dd>
            <dt>
              <span id="address">Address</span>
            </dt>
            <dd>{localeEntity.address}</dd>
            <dt>
              <span id="region">Region</span>
            </dt>
            <dd>{localeEntity.region}</dd>
            <dt>
              <span id="province">Province</span>
            </dt>
            <dd>{localeEntity.province}</dd>
            <dt>
              <span id="city">City</span>
            </dt>
            <dd>{localeEntity.city}</dd>
            <dt>Client</dt>
            <dd>{localeEntity.client ? localeEntity.client.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/locale" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/locale/${localeEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ locale }: IRootState) => ({
  localeEntity: locale.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocaleDetail);
