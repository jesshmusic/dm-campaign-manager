import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import GenerateMonster from './components/generate-monster/GenerateMonster';
import Convert2eMonster from './Convert2eMonster';
import GenerateCommoner from './components/GenerateCommoner';
import { GiBlacksmith, GiSpikedDragonHead, SiConvertio } from 'react-icons/all';
import MonsterBlock from '../monsters/MonsterBlock';
import rest from '../../api/api';
import { connect } from 'react-redux';
import { UserProps } from '../../utilities/types';

const styles = require('./monster-generator.module.scss');

const MonsterGenerator = (props: {
  monster: any;
  generateCommoner: (gender?: string, race?: string, token?: string) => void;
  generateMonster: (monster: any, token?: string) => void;
  convert2eNPC: () => void;
  token?: string;
}) => {
  const { token, monster, generateCommoner, generateMonster, convert2eNPC } =
    props;
  const show2eConverter = false;

  return (
    <PageContainer
      pageTitle={'Monster Generators and Converters'}
      description={
        'Several generators to build quick Monsters. Fields can be copied and pasted into Fantasy Grounds.'
      }
      breadcrumbs={[{ isActive: true, title: 'Monster Generator' }]}
    >
      <PageTitle title={'Monster Generators and Converters'} />
      <div className={styles.monsterGenWrapper}>
        <p>
          Several generators to build quick Monsters. Fields can be copied and
          pasted into Fantasy Grounds.
        </p>

        {monster ? <MonsterBlock monster={monster} /> : null}

        <div
          className="accordion accordion-flush"
          id="monsterGeneratorAccordion"
        >
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
                <GenerateCommoner
                  onFormSubmit={generateCommoner}
                  token={token}
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
                Generate Monster
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
    token: state.users.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    generateCommoner: (
      gender: string = 'Female',
      race: string = 'Human',
      token?: string
    ) => {
      dispatch(
        rest.actions.generateCommoner(
          { gender, race },
          {
            body: JSON.stringify({ token }),
          }
        )
      );
    },
    generateMonster: (monster: any, token?: string) => {
      dispatch(
        rest.actions.generateMonster(
          {},
          {
            body: JSON.stringify({ monster, token }),
          }
        )
      );
    },
    convert2eNPC: () => {
      dispatch(rest.actions.generateCommoner());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MonsterGenerator);
