import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './locale.reducer';
import { ILocale } from 'app/shared/model/locale.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ILocaleProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Locale extends React.Component<ILocaleProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { localeList, match } = this.props;
    return (
      <div>
        <h2 id="locale-heading">
          Locales
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new Locale
          </Link>
        </h2>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Region</th>
                <th>Province</th>
                <th>City</th>
                <th>Client</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {localeList.map((locale, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${locale.id}`} color="link" size="sm">
                      {locale.id}
                    </Button>
                  </td>
                  <td>{locale.name}</td>
                  <td>{locale.address}</td>
                  <td>{locale.region}</td>
                  <td>{locale.province}</td>
                  <td>{locale.city}</td>
                  <td>{locale.client ? <Link to={`client/${locale.client.id}`}>{locale.client.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${locale.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${locale.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${locale.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
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

const mapStateToProps = ({ locale }: IRootState) => ({
  localeList: locale.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Locale);
