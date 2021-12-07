import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { PageProps } from '../../utilities/types';
import { useAuth0 } from '@auth0/auth0-react';
import NameField from '../front-page/components/NameField';
import TavernNameField from '../front-page/components/TavernNameField';
import { connect } from 'react-redux';
import NPCGenButton from './components/NPCGenButton';
import Widget from './components/Widget';
import DashboardBar from './components/DashboardBar';

const ResponsiveGridLayout = WidthProvider(Responsive);

const styles = require('./user-dashboard.module.scss');

const getFromLS = (key) => {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('rgl-8') as string) || {};
    } catch (e) {}
  }
  return ls[key];
};
const saveToLS = (key, value) => {
  if (global.localStorage) {
    global.localStorage.setItem(
      'rgl-8',
      JSON.stringify({
        [key]: value,
      })
    );
  }
};

const dashboardItems = ['a', 'b', 'c'];

const initialLayouts = {
  lg: [
    { i: 'a', x: 0, y: 0, w: 1, h: 1 },
    { i: 'b', x: 1, y: 0, w: 1, h: 1 },
    { i: 'c', x: 2, y: 0, w: 1, h: 1 },
    { i: 'd', x: 3, y: 0, w: 1, h: 1 },
  ],
};

const dashboardComponents = {
  a: {
    component: NameField,
    title: 'Random Character Name',
    subtitle: 'Generate a random fantasy name based on gender and race',
  },
  b: {
    component: TavernNameField,
    title: 'Random Tavern Name',
    subtitle: 'Generate a random tavern nam',
  },
  c: {
    component: NPCGenButton,
    title: 'NPC Generator',
    subtitle: 'Quickly create custom NPCs of any challenge rating',
  },
};

const UserDashboard = (props: PageProps) => {
  const [items, setItems] = React.useState(dashboardItems);
  const [layouts, setLayouts] = React.useState(getFromLS('layouts') || initialLayouts);
  const onLayoutChange = (currentLayouts, allLayouts) => {
    setLayouts(allLayouts);
  };
  const onLayoutSave = () => {
    saveToLS('layouts', layouts);
  };
  const onRemoveItem = (itemId) => {
    setItems(items.filter((i) => i !== itemId));
  };
  const onAddItem = (itemId) => {
    setItems([...items, itemId]);
  };

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
          <DashboardBar
            onLayoutSave={onLayoutSave}
            items={items}
            onRemoveItem={onRemoveItem}
            onAddItem={onAddItem}
            originalItems={dashboardItems}
          />
          <ResponsiveGridLayout
            autoSize={true}
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1500, md: 1200, sm: 900, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
            rowHeight={300}
            onLayoutChange={onLayoutChange}
          >
            {items.map((key) => (
              <div key={key} className="widget" data-grid={{ w: 2, h: 1, x: 0, y: Infinity }}>
                <Widget
                  id={key}
                  onRemoveItem={onRemoveItem}
                  component={dashboardComponents[key].component}
                  hideFrame={true}
                  title={dashboardComponents[key].title}
                  subtitle={dashboardComponents[key].subtitle}
                />
              </div>
            ))}
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
