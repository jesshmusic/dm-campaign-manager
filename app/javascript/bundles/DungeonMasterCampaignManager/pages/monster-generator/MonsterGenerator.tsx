import React, { useEffect } from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import GenerateMonster from './components/generate-monster/GenerateMonster';
import Convert2eMonster from './Convert2eMonster';
import GenerateCommoner from './components/GenerateCommoner';
import { GiBlacksmith, GiSpikedDragonHead, GiDiceTwentyFacesTwenty } from 'react-icons/gi';
import { SiConvertio } from 'react-icons/si';
import MonsterBlock from '../monsters/MonsterBlock';
import rest from '../../api/api';
import { connect } from 'react-redux';
import QuickGenerateMonster from './components/quick-generate-monster/QuickGenerateMonster';
import ReactGA from 'react-ga4';
import { MonsterProps } from '../../utilities/types';
import { clearCurrentMonster } from '../../reducers/monsters';

ReactGA.initialize('G-8XJTH70JSQ');

import { GiCrossMark } from 'react-icons/gi';
import {
  MonsterGenWrapper,
  MonsterDisplayWrapper,
  MonsterCloseButton,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from './MonsterGenerator.styles';

const MonsterGenerator = (props: {
  monster?: MonsterProps;
  clearMonster: () => void;
  generateCommoner: (gender?: string, race?: string, token?: string) => void;
  generateMonster: (monster: Record<string, unknown>, token?: string) => void;
  generateQuickMonster: (monster: Record<string, unknown>, token?: string) => void;
  isLoading?: boolean;
  token?: string;
}) => {
  const {
    token,
    isLoading,
    monster,
    clearMonster,
    generateCommoner,
    generateMonster,
    generateQuickMonster,
  } = props;
  const show2eConverter = false;

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

        <TabsRoot defaultValue="commoner">
          <TabsList>
            <TabsTrigger value="commoner">
              <GiBlacksmith size={20} /> Commoner
            </TabsTrigger>
            <TabsTrigger value="quick-monster">
              <span
                style={{ display: 'inline-block', position: 'relative', width: 30, height: 30 }}
              >
                <GiDiceTwentyFacesTwenty
                  size={30}
                  color="#dd9529"
                  style={{ position: 'absolute', left: 0, top: 0 }}
                />
                <GiSpikedDragonHead size={20} style={{ position: 'absolute', left: 5, top: 5 }} />
              </span>
              Quick NPC
            </TabsTrigger>
            <TabsTrigger value="create-monster">
              <GiSpikedDragonHead size={20} /> Create NPC
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

          <TabsContent value="quick-monster">
            <QuickGenerateMonster
              onGenerateMonster={generateQuickMonster}
              token={token}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="create-monster">
            <GenerateMonster
              onGenerateMonster={generateMonster}
              token={token}
              isLoading={isLoading}
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
    generateCommoner: (gender: string = 'Female', race: string = 'Human', token?: string) => {
      ReactGA.event('NPC Generator');
      dispatch(
        rest.actions.generateCommoner(
          { gender, race },
          {
            body: JSON.stringify({ token }),
          },
        ),
      );
    },
    generateMonster: (monster: unknown, token?: string) => {
      ReactGA.event('NPC Generator');
      dispatch(
        rest.actions.generateMonster(
          {},
          {
            body: JSON.stringify({ monster, token }),
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
