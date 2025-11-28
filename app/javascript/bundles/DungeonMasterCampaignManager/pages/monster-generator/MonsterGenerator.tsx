import React from 'react';
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

ReactGA.initialize('G-8XJTH70JSQ');

import styles from './monster-generator.module.scss';

const MonsterGenerator = (props: {
  monster?: MonsterProps;
  generateCommoner: (gender?: string, race?: string, token?: string) => void;
  generateMonster: (monster: Record<string, unknown>, token?: string) => void;
  generateQuickMonster: (monster: Record<string, unknown>, token?: string) => void;
  isLoading?: boolean;
  token?: string;
}) => {
  const { token, isLoading, monster, generateCommoner, generateMonster, generateQuickMonster } =
    props;
  const show2eConverter = false;

  return (
    <PageContainer
      pageTitle={'Monster Generators and Converters'}
      description={
        'Several generators to build quick Monsters. Fields can be copied and pasted into Fantasy Grounds.'
      }
    >
      <PageTitle title={'Monster Generators and Converters'} />
      <div className={styles.monsterGenWrapper}>
        <p>
          Several generators to build quick Monsters. Fields can be copied and pasted into Fantasy
          Grounds.
        </p>

        {monster ? <MonsterBlock monster={monster} showCRStats /> : null}

        <div className="accordion accordion-flush" id="monsterGeneratorAccordion">
          <div className="accordion-item">
            <h3 className="accordion-header" id="commonerGeneratorHeading">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#commonerGenerator"
              >
                <GiBlacksmith className={'me-2'} size={30} /> Commoner
              </button>
            </h3>
            <div
              id="commonerGenerator"
              className="accordion-collapse collapse"
              aria-labelledby="commonerGeneratorHeading"
              data-bs-parent="#monsterGeneratorAccordion"
            >
              <div className="accordion-body">
                <GenerateCommoner onFormSubmit={generateCommoner} token={token} />
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h3 className="accordion-header" id="quickMonsterGeneratorHeading">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#quickMonsterGenerator"
              >
                <span style={{ display: 'inline-block', position: 'relative' }}>
                  <GiDiceTwentyFacesTwenty
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    size={40}
                    color="#dd9529"
                  />
                  <GiSpikedDragonHead
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    style={{
                      fontSize: '30px',
                      position: 'absolute',
                      left: '5px',
                      bottom: '5px',
                    }}
                  />
                </span>
                Generate Monster
              </button>
            </h3>
            <div
              id="quickMonsterGenerator"
              className="accordion-collapse collapse"
              aria-labelledby="quickMonsterGeneratorHeading"
              data-bs-parent="#monsterGeneratorAccordion"
            >
              <div className="accordion-body">
                <QuickGenerateMonster
                  onGenerateMonster={generateQuickMonster}
                  token={token}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h3 className="accordion-header" id="monsterGeneratorHeading">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#monsterGenerator"
              >
                <GiSpikedDragonHead className={'me-2'} size={30} />
                Create Monster
              </button>
            </h3>
            <div
              id="monsterGenerator"
              className="accordion-collapse collapse"
              aria-labelledby="monsterGeneratorHeading"
              data-bs-parent="#monsterGeneratorAccordion"
            >
              <div className="accordion-body">
                <GenerateMonster
                  onGenerateMonster={generateMonster}
                  token={token}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
          {show2eConverter && (
            <div className="accordion-item">
              <h3 className="accordion-header" id="dnd2eGeneratorHeading">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#dnd2eGenerator"
                >
                  <SiConvertio className={'me-2'} size={30} />
                  Convert 2nd Edition
                </button>
              </h3>
              <div
                id="dnd2eGenerator"
                className="accordion-collapse collapse"
                aria-labelledby="dnd2eGeneratorHeading"
                data-bs-parent="#monsterGeneratorAccordion"
              >
                <div className="accordion-body">
                  <Convert2eMonster token={token} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
