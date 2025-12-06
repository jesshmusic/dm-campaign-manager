import React, { useEffect, useState } from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import Convert2eMonster from './Convert2eMonster';
import GenerateCommoner from './components/GenerateCommoner';
import { GiBlacksmith, GiSpikedDragonHead, GiCrossMark, GiMagicSwirl } from 'react-icons/gi';
import { SiConvertio } from 'react-icons/si';
import MonsterBlock from '../monsters/MonsterBlock';
import rest from '../../api/api';
import { connect } from 'react-redux';
import QuickGenerateMonster from './components/quick-generate-monster/QuickGenerateMonster';
import AIGenerateMonster from './components/ai-generate-monster/AIGenerateMonster';
import ReactGA from 'react-ga4';
import { MonsterProps, UserProps } from '../../utilities/types';
import { clearCurrentMonster, setCurrentMonster } from '../../reducers/monsters';

ReactGA.initialize('G-8XJTH70JSQ');
import {
  MonsterGenWrapper,
  MonsterDisplayWrapper,
  MonsterCloseButton,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from './MonsterGenerator.styles';

const VALID_TABS = ['commoner', 'create', 'quick'];

const getInitialTab = (): string => {
  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = searchParams.get('tab');
  return tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'commoner';
};

const MonsterGenerator = (props: {
  monster?: MonsterProps;
  currentUser?: UserProps;
  clearMonster: () => void;
  setMonster: (monster: MonsterProps) => void;
  generateCommoner: (
    gender?: string,
    race?: string,
    role?: string,
    description?: string,
    token?: string,
  ) => void;
  generateQuickMonster: (monster: Record<string, unknown>, token?: string) => void;
  isLoading?: boolean;
  token?: string;
}) => {
  const {
    token,
    isLoading,
    monster,
    currentUser,
    clearMonster,
    setMonster,
    generateCommoner,
    generateQuickMonster,
  } = props;
  const isAdmin = currentUser?.role === 'admin';
  const show2eConverter = false;
  const [activeTab, setActiveTab] = useState(getInitialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.replaceState({}, '', url.toString());
  };

  useEffect(() => {
    return () => {
      clearMonster();
    };
  }, [clearMonster]);

  return (
    <PageContainer
      pageTitle={'NPC & Creature Generators'}
      description={
        'Create NPCs, monsters, and creatures for your D&D campaigns. Generate stat blocks that can be copied into Fantasy Grounds or other VTTs.'
      }
    >
      <PageTitle title={'NPC & Creature Generators'} />
      <MonsterGenWrapper>
        <p>
          Create NPCs, monsters, and creatures for your D&D campaigns. Generate stat blocks
          compatible with Fantasy Grounds and other virtual tabletops.
        </p>

        {monster ? (
          <MonsterDisplayWrapper>
            <MonsterCloseButton
              onClick={clearMonster}
              aria-label="Close monster display"
              title="Close"
            >
              <GiCrossMark size={20} />
            </MonsterCloseButton>
            <MonsterBlock monster={monster} showCRStats />
          </MonsterDisplayWrapper>
        ) : null}

        <TabsRoot value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="commoner">
              <GiBlacksmith size={20} /> Commoner
            </TabsTrigger>
            <TabsTrigger value="create">
              <GiSpikedDragonHead size={20} /> Create NPC
            </TabsTrigger>
            <TabsTrigger value="quick">
              <GiMagicSwirl size={20} /> Quick NPC
            </TabsTrigger>
            {show2eConverter && (
              <TabsTrigger value="convert-2e">
                <SiConvertio size={20} /> Convert 2nd Edition
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="commoner">
            <GenerateCommoner isLoading={isLoading} onFormSubmit={generateCommoner} token={token} />
          </TabsContent>

          <TabsContent value="create">
            <QuickGenerateMonster
              onGenerateMonster={generateQuickMonster}
              token={token}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="quick">
            <AIGenerateMonster
              onMonsterCreated={(monster) => setMonster(monster as MonsterProps)}
              token={token}
              isLoading={isLoading}
              isAdmin={isAdmin}
            />
          </TabsContent>

          {show2eConverter && (
            <TabsContent value="convert-2e">
              <Convert2eMonster token={token} />
            </TabsContent>
          )}
        </TabsRoot>
      </MonsterGenWrapper>
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    monster: state.monsters.currentMonster,
    currentUser: state.users.currentUser,
    isLoading: state.monsters.loading,
    token: state.users.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearMonster: () => {
      dispatch(clearCurrentMonster());
    },
    setMonster: (monster: MonsterProps) => {
      dispatch(setCurrentMonster(monster));
    },
    generateCommoner: (
      gender: string = 'Female',
      race: string = 'Human',
      role: string = '',
      description: string = '',
      token?: string,
    ) => {
      ReactGA.event('NPC Generator');
      dispatch(
        rest.actions.generateCommoner(
          { gender, race, role, description: encodeURIComponent(description) },
          {
            body: JSON.stringify({ token }),
          },
        ),
      );
    },
    generateQuickMonster: (monster: unknown, token?: string) => {
      ReactGA.event('NPC Generator');
      dispatch(
        rest.actions.generateQuickMonster(
          {},
          {
            body: JSON.stringify({ monster, token }),
          },
        ),
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MonsterGenerator);
