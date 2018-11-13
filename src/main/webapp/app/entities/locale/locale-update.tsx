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
import { getEntity, updateEntity, createEntity, reset } from './locale.reducer';
import { ILocale } from 'app/shared/model/locale.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ILocaleUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface ILocaleUpdateState {
  isNew: boolean;
  clientId: string;
}

export class LocaleUpdate extends React.Component<ILocaleUpdateProps, ILocaleUpdateState> {
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
      const { localeEntity } = this.props;
      const entity = {
        ...localeEntity,
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
    this.props.history.push('/entity/locale');
  };

  render() {
    const { localeEntity, clients, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sigApp.locale.home.createOrEditLabel">Create or edit a Locale</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : localeEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">ID</Label>
                    <AvInput id="locale-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="nameLabel" for="name">
                    Name
                  </Label>
                  <AvField id="locale-name" type="text" name="name" />
                </AvGroup>
                <AvGroup>
                  <Label id="addressLabel" for="address">
                    Address
                  </Label>
                  <AvField id="locale-address" type="text" name="address" />
                </AvGroup>
                <AvGroup>
                  <Label id="regionLabel" for="region">
                    Region
                  </Label>
                  <AvField id="locale-region" type="text" name="region" />
                </AvGroup>
                <AvGroup>
                  <Label id="provinceLabel" for="province">
                    Province
                  </Label>
                  <AvField id="locale-province" type="text" name="province" />
                </AvGroup>
                <AvGroup>
                  <Label id="cityLabel" for="city">
                    City
                  </Label>
                  <AvField id="locale-city" type="text" name="city" />
                </AvGroup>
                <AvGroup>
                  <Label for="client.id">Client</Label>
                  <AvInput id="locale-client" type="select" className="form-control" name="client.id">
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
                <Button tag={Link} id="cancel-save" to="/entity/locale" replace color="info">
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
  localeEntity: storeState.locale.entity,
  loading: storeState.locale.loading,
  updating: storeState.locale.updating,
  updateSuccess: storeState.locale.updateSuccess
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
)(LocaleUpdate);
