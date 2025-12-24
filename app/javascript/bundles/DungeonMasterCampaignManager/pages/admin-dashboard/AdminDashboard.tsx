import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { UserProps } from '../../utilities/types';
import MonstersTable from '../monsters/MonstersTable';
import UsersTable from './components/UsersTable';
import { GiBarbute, GiBlacksmith } from 'react-icons/gi';
import { FaMap } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ActionsTable from './components/ActionsTable';
import WidgetsTable from './components/WidgetsTable';
import MapsTable from './components/MapsTable';
import { connect } from 'react-redux';
import Frame from '../../components/Frame/Frame';
import Button from '../../components/Button/Button';
import { Colors } from '../../utilities/enums';

import packageJson from '../../../../../../package.json';

import { Wrapper, Section, InfoContainer } from './AdminDashboard.styles';
import { RootState, AppDispatch } from '../../store/store';

const AdminDashboard = (props: {
  actionCount: number;
  npcCount: number;
  widgetCount: number;
  user: UserProps;
  userCount: number;
}) => {
  const { actionCount, npcCount, user, userCount } = props;
  const navigate = useNavigate();

  return (
    <PageContainer
      pageTitle={'DM Screen Admin'}
      description={
        'Dungeon Master GURU is a free resource for DMs for reference that includes tools for smooth games.'
      }
    >
      <PageTitle title="DM Screen Admin" />
      <Wrapper>
        <Section>
          <h2>Site Statistics</h2>
          <InfoContainer>
            <Frame style={{ width: '100%', height: '100%' }} title={'Info'}>
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
            <Frame style={{ width: '100%', height: '100%' }} title={'Site'}>
              <p>
                <strong>Version:</strong> {packageJson.version}
              </p>
            </Frame>
          </InfoContainer>
          <Section>
            <h3>Users</h3>
            <UsersTable />
          </Section>
        </Section>
        <Section>
          <h2>Content</h2>

          <Section>
            <h3>
              <FaMap className={'me-2'} /> Foundry Maps
            </h3>
            <Button
              onClick={() => navigate('/app/admin-dashboard/foundry-maps')}
              color={Colors.primary}
              title="Manage Foundry Maps"
              icon={<FaMap />}
            />
            <MapsTable />
          </Section>

          <Section>
            <h3>
              <GiBlacksmith className={'me-2'} /> User Created NPCs
            </h3>
            <Button
              onClick={() => navigate('/app/monster-generator')}
              color={Colors.primary}
              title="NPC Generators"
              icon={<GiBarbute />}
            />
            {user ? <MonstersTable user={user} /> : null}
          </Section>

          <Section>
            <h3>
              <GiBlacksmith className={'me-2'} /> Widgets
            </h3>
            <Button
              onClick={() => navigate('/app/admin-dashboard/create-widget')}
              color={Colors.primary}
              title="Create Widget"
              icon={<GiBarbute />}
            />
            <WidgetsTable />
          </Section>

          <Section>
            <h3>
              <GiBlacksmith className={'me-2'} /> Custom Actions
            </h3>
            <Button
              onClick={() => navigate('/app/admin-dashboard/create-custom-action')}
              color={Colors.primary}
              title="Create Custom Action"
              icon={<GiBarbute />}
            />
            <ActionsTable />
          </Section>
        </Section>
      </Wrapper>
    </PageContainer>
  );
};

function mapStateToProps(state: RootState) {
  return {
    actionCount: state.customActions.count,
    npcCount: state.monsters.count,
    user: state.users.currentUser,
    userCount: state.users.count,
    widgetCount: state.widgets.count,
  };
}

function mapDispatchToProps(_dispatch: AppDispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
