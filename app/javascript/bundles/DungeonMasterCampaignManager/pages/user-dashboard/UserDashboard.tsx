import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { PageProps } from '../../utilities/types';
import { useAuth0 } from '@auth0/auth0-react';
import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';

import { Section, UserInfo, UserPic, UserData } from './UserDashboard.styles';

const UserDashboard = (_props: PageProps) => {
  const { isAuthenticated, user } = useAuth0();
  const pageTitle = isAuthenticated && user ? `Welcome, ${user.name}` : 'Welcome';

  return (
    <PageContainer
      pageTitle={pageTitle}
      description={
        'Dungeon Master GURU is an online DM Screen with tools and widgets that make your life easier.'
      }
    >
      <PageTitle title={`Dungeon Master GURU - ${pageTitle}`} isDraconis />
      <Section>
        <h2>Info</h2>
        <UserInfo>
          <UserPic>
            <img src={user!.picture} />
          </UserPic>
          <UserData>
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
          </UserData>
        </UserInfo>
      </Section>
      <Dashboard />
    </PageContainer>
  );
};

function mapStateToProps(state: any) {
  return {
    currentUser: state.users.currentUser,
  };
}

function mapDispatchToProps(_dispatch: any) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);
