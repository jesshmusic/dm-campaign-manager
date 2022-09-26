import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { UserProps } from '../../utilities/types';
import MonstersTable from '../monsters/MonstersTable';
import UsersTable from './components/UsersTable';
import { GiBarbute, GiBlacksmith } from 'react-icons/all';
import { Link } from 'react-router-dom';
import ActionsTable from './components/ActionsTable';
import WidgetsTable from './components/WidgetsTable';
import { connect } from 'react-redux';
import Frame from '../../components/Frame/Frame';

const packageJson = require('../../../../../../package.json');

const styles = require('./admin-dashboard.module.scss');

const AdminDashboard = (props: {
  actionCount: number;
  npcCount: number;
  widgetCount: number;
  user: UserProps;
  userCount: number;
}) => {
  const { actionCount, npcCount, user, userCount, widgetCount } = props;

  return (
    <PageContainer
      pageTitle={'DM Screen Admin'}
      description={
        'Dungeon Master GURU is a free resource for DMs for reference that includes tools for smooth games.'
      }
    >
      <PageTitle title="DM Screen Admin" />
      <div className={styles.wrapper}>
        <div className={styles.section}>
          <h2>Site Statistics</h2>
          <div className={`${styles.section} ${styles.infoContainer}`}>
            <Frame
              className={styles.infoFrame}
              style={{ width: '100%', height: '100%' }}
              title={'Info'}
            >
              <p>
                <strong>Users:</strong> {userCount}
              </p>
              <p>
                <strong>Custom Actions:</strong> {actionCount}
              </p>
              <p>
                <strong>Custom NPCs:</strong> {npcCount}
              </p>
            </Frame>
            <Frame
              className={styles.infoFrame}
              style={{ width: '100%', height: '100%' }}
              title={'Site'}
            >
              <p>
                <strong>Version:</strong> {packageJson.version}
              </p>
            </Frame>
          </div>
          <div className={styles.section}>
            <h3>Users</h3>
            <UsersTable />
          </div>
        </div>
        <div className={styles.section}>
          <h2>Content</h2>
          <div className="accordion accordion-flush" id="adminAccordion">
            <div className="accordion-item">
              <h3 className="accordion-header" id="userNpcsAdminHeading">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#userNpcsAdmin"
                >
                  <GiBlacksmith className={'me-2'} size={30} /> User Created NPCs
                </button>
              </h3>
              <div
                id="userNpcsAdmin"
                className="accordion-collapse collapse"
                aria-labelledby="userNpcsAdminHeading"
                data-bs-parent="#adminAccordion"
              >
                <div className="accordion-body">
                  <Link to="/app/monster-generator" className={styles.buttonBar}>
                    <GiBarbute size={24} /> NPC Generators
                  </Link>
                  {user ? <MonstersTable user={user} /> : null}
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h3 className="accordion-header" id="widgetsAdminHeading">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#widgetsAdmin"
                >
                  <GiBlacksmith className={'me-2'} size={30} /> Widgets
                </button>
              </h3>
              <div
                id="widgetsAdmin"
                className="accordion-collapse collapse"
                aria-labelledby="widgetsAdminHeading"
                data-bs-parent="#adminAccordion"
              >
                <div className="accordion-body">
                  <Link to="/app/admin-dashboard/create-widget" className={styles.buttonBar}>
                    <GiBarbute size={24} /> Create Widget
                  </Link>
                  <WidgetsTable />
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h3 className="accordion-header" id="actionsAdminHeading">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#actionsAdmin"
                >
                  <GiBlacksmith className={'me-2'} size={30} /> Custom Actions
                </button>
              </h3>
              <div
                id="actionsAdmin"
                className="accordion-collapse collapse"
                aria-labelledby="actionsAdminHeading"
                data-bs-parent="#adminAccordion"
              >
                <div className="accordion-body">
                  <Link
                    to="/app/admin-dashboard/create-custom-action"
                    className={styles.buttonBarGreen}
                  >
                    <GiBarbute size={24} /> Create Custom Action
                  </Link>
                  <ActionsTable />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    actionCount: state.customActions.count,
    npcCount: state.monsters.count,
    user: state.users.currentUser,
    userCount: state.users.count,
    widgetCount: state.widgets.count,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
