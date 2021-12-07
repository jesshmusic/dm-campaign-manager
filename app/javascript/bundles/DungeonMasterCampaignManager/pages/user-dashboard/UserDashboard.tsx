import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = WidthProvider(Responsive);
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Link } from 'react-router-dom';
import { PageProps } from '../../utilities/types';
import { GiBarbute } from 'react-icons/all';
import { useAuth0 } from '@auth0/auth0-react';
import NameField from '../front-page/components/NameField';
import TavernNameField from '../front-page/components/TavernNameField';
import { connect } from 'react-redux';
import Frame from '../../components/Frame/Frame';

const styles = require('./user-dashboard.module.scss');

const Widget = (props: { children: React.ReactNode; title: string; subtitle: string }) => {
  return (
    <Frame style={{ width: '100%', height: '100%' }} title={props.title} subtitle={props.subtitle}>
      <div>{props.children}</div>
    </Frame>
  );
};

const defaultLayout = [
  { i: 'a', x: 0, y: 0, w: 1, h: 1 },
  { i: 'b', x: 1, y: 0, w: 1, h: 1 },
  { i: 'c', x: 2, y: 0, w: 1, h: 1 },
  { i: 'd', x: 3, y: 0, w: 1, h: 1 },
];

const UserDashboard = (props: PageProps) => {
  const layouts = {
    lg: defaultLayout,
    md: defaultLayout,
    sm: defaultLayout,
  };
  const { currentUser } = props;
  const { isAuthenticated, user } = useAuth0();
  const pageTitle = isAuthenticated && user ? `Welcome, ${user.name}` : 'Welcome';

  return (
    <PageContainer
      pageTitle={pageTitle}
      description={
        "Dungeon Master's Screen is an online DM Screen with tools and widgets that make your life easier."
      }
    >
      <div className={styles.wrapper}>
        <PageTitle title={`The Dungeon Master Screen - ${pageTitle}`} isDraconis />
        <div className={styles.section}>
          <h2>Info</h2>
          <div className={styles.userInfo}>
            <div className={styles.userPic}>
              <img src={user!.picture} />
            </div>
            <div className={styles.userData}>
              <p>
                <strong>Name</strong>
                {user!.name}
              </p>
              <p>
                <strong>Username</strong>
                {user!.nickname}
              </p>
              <p>
                <strong>Email</strong>
                {user!.email}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <h2>Dashboard</h2>
          <ResponsiveGridLayout
            autoSize={true}
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1500, md: 1200, sm: 900, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
            rowHeight={300}
          >
            <div key="a">
              <Widget
                title="NPC Generator"
                subtitle="Quickly create custom NPCs of any challenge rating"
              >
                <Link to="/app/monster-generator" className={styles.buttonBar}>
                  <GiBarbute size={24} /> NPC Generators
                </Link>
              </Widget>
            </div>
            <div key="b">
              <Widget
                title="Random Character Name"
                subtitle="Generate a random fantasy name based on gender and race"
              >
                <NameField hideFrame />
              </Widget>
            </div>
            <div key="c">
              <Widget title="Random Tavern Name" subtitle="Generate a random tavern name">
                <TavernNameField hideFrame />
              </Widget>
            </div>
          </ResponsiveGridLayout>
        </div>
      </div>
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);
