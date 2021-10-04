import React from 'react';
import { connect } from 'react-redux';
import { Link } from '@reach/router';

const ItemsNav = () => (
  <ul className="nav nav-pills nav-fill sans-serif">
    <li className="nav-item">
      <Link
        to={'/app/items/'}
        getProps={({ isCurrent }) => {
          return {
            className: isCurrent ? 'nav-link active' : 'nav-link',
          };
        }}
      >
        All Equipment and Items
      </Link>
    </li>
    <li className="nav-item">
      <Link
        to={'/app/items/armor/'}
        getProps={({ isCurrent }) => {
          return {
            className: isCurrent ? 'nav-link active' : 'nav-link',
          };
        }}
      >
        Armor
      </Link>
    </li>
    <li className="nav-item">
      <Link
        to={'/app/items/gear/'}
        getProps={({ isCurrent }) => {
          return {
            className: isCurrent ? 'nav-link active' : 'nav-link',
          };
        }}
      >
        Adventuring Gear
      </Link>
    </li>
    <li className="nav-item">
      <Link
        to={'/app/items/magic-items/'}
        getProps={({ isCurrent }) => {
          return {
            className: isCurrent ? 'nav-link active' : 'nav-link',
          };
        }}
      >
        Magic Items
      </Link>
    </li>
    <li className="nav-item">
      <Link
        to={'/app/items/magic-armor/'}
        getProps={({ isCurrent }) => {
          return {
            className: isCurrent ? 'nav-link active' : 'nav-link',
          };
        }}
      >
        Magic Armor
      </Link>
    </li>
    <li className="nav-item">
      <Link
        to={'/app/items/magic-weapons/'}
        getProps={({ isCurrent }) => {
          return {
            className: isCurrent ? 'nav-link active' : 'nav-link',
          };
        }}
      >
        Magic Weapons
      </Link>
    </li>
    <li className="nav-item">
      <Link
        to={'/app/items/vehicles/'}
        getProps={({ isCurrent }) => {
          return {
            className: isCurrent ? 'nav-link active' : 'nav-link',
          };
        }}
      >
        Mounts and Vehicles
      </Link>
    </li>
    <li className="nav-item">
      <Link
        to={'/app/items/tools/'}
        getProps={({ isCurrent }) => {
          return {
            className: isCurrent ? 'nav-link active' : 'nav-link',
          };
        }}
      >
        Tools
      </Link>
    </li>
    <li className="nav-item">
      <Link
        to={'/app/items/weapons/'}
        getProps={({ isCurrent }) => {
          return {
            className: isCurrent ? 'nav-link active' : 'nav-link',
          };
        }}
      >
        Weapons
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
