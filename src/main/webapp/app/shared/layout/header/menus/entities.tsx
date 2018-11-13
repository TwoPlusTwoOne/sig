import React from 'react';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from '../header-components';

export const EntitiesMenu = props => (
  // tslint:disable-next-line:jsx-self-close
  <NavDropdown icon="th-list" name="Entities" id="entity-menu">
    <DropdownItem tag={Link} to="/entity/purchase-order">
      <FontAwesomeIcon icon="asterisk" />
      &nbsp;Purchase Order
    </DropdownItem>
    <DropdownItem tag={Link} to="/entity/client">
      <FontAwesomeIcon icon="asterisk" />
      &nbsp;Client
    </DropdownItem>
    <DropdownItem tag={Link} to="/entity/locale">
      <FontAwesomeIcon icon="asterisk" />
      &nbsp;Locale
    </DropdownItem>
    <DropdownItem tag={Link} to="/entity/product">
      <FontAwesomeIcon icon="asterisk" />
      &nbsp;Product
    </DropdownItem>
    <DropdownItem tag={Link} to="/entity/truck">
      <FontAwesomeIcon icon="asterisk" />
      &nbsp;Truck
    </DropdownItem>
    <DropdownItem tag={Link} to="/entity/product-in-purchase-order">
      <FontAwesomeIcon icon="asterisk" />
      &nbsp;Product In Purchase Order
    </DropdownItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
