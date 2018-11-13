import * as React from 'react';
import { Button, Col, Row, Table, Progress } from 'reactstrap';
import { Redirect } from 'react-router';
import { toast } from 'react-toastify';

export class Sap extends React.Component {
  state = {
    redirect: ''
  };

  componentDidMount() {
    setTimeout(this.redirect, 3000);
  }

  redirect = () => {
    toast.success('Enviado a SAP');
    this.setState({ redirect: '/' });
  };

  render() {
    const { redirect } = this.state;

    if (redirect) return <Redirect to={redirect} />;
    return (
      <div>
        <Row class={'align-items-center'}>
          <Col md={'4'} />
          <Col md={'4'} class={'align-items-center justify-content-center'}>
            <div style={{ textAlign: 'center' }}>
              <h3>Sending to SAP...</h3>
              <Progress animated color="info" value={100} />
            </div>
          </Col>
          <Col md={'4'} />
        </Row>
      </div>
    );
  }
}
