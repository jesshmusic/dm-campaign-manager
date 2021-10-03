import React from 'react';
import { connect } from 'react-redux';
import { Link } from '@reach/router';

const ItemsNav = () => (
  <ul className="nav justify-content-center">
    <li className="nav-item">
      <Link to={'/app/items/'} className="nav-link">
        All Equipment and Items
      </Link>
    </li>
    <li className="nav-item">
      <Link to={'/app/items/armor/'} className="nav-link">
        Armor
      </Link>
    </li>
    <li className="nav-item">
      <Link to={'/app/items/weapons/'} className="nav-link">
        Weapons
      </Link>
    </li>
    <li className="nav-item">
      <Link to={'/app/items/magic-items/'} className="nav-link">
        Magic Items
      </Link>
    </li>
    <li className="nav-item">
      <Link to={'/app/items/gear/'} className="nav-link">
        Adventuring Gear
      </Link>
    </li>
    <li className="nav-item">
      <Link to={'/app/items/tools/'} className="nav-link">
        Tools
      </Link>
    </li>
    <li className="nav-item">
      <Link to={'/app/items/vehicles/'} className="nav-link">
        Mounts and Vehicles
      </Link>
    </li>
  </ul>
);

function mapStateToProps(state) {
  return {
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

export default connect(mapStateToProps, {})(ItemsNav);
