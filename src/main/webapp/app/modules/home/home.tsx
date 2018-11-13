import './home.css';

import React from 'react';
import { Link, Route, RouteComponentProps, HashRouter as Router } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';

import { getSession } from 'app/shared/reducers/authentication';

import { default as UserView } from '../user-view';

export interface IHomeProp extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    const { account } = this.props;

    const username = account ? account.firstName : '';

    return (
      <Row>
        <Col md="12">
          {account && account.login && <h2>Bienvenido, {username}</h2>}
          <p className="lead">Órdenes de compra</p>
          {account && account.login ? (
            account.login === 'user' ? (
              <UserView match={this.props.match} />
            ) : (
              <div>
                <Alert color="success">Sos admin, amigo. {account.login}.</Alert>
              </div>
            )
          ) : (
            <div>
              <Alert color="warning">
                You do not have an account yet?&nbsp;
                <Link to="/register" className="alert-link">
                  Register a new account
                </Link>
              </Alert>
            </div>
          )}
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

const mapDispatchToProps = { getSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
