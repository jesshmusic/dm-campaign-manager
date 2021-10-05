import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import MonsterDisplay from './MonsterDisplay';
import GenerateMonster from './components/GenerateMonster';
import Convert2eMonster from './Convert2eMonster';
import GenerateCommoner from './components/GenerateCommoner';
import { GiBlacksmith, GiSpikedDragonHead, SiConvertio } from 'react-icons/all';
import axios from 'axios';
import { MonsterProps } from '../../utilities/types';

const MonsterGenerator = () => {
  const [monster, setMonster] = React.useState<MonsterProps | undefined>();

  const handleGenerateCommoner = (
    gender: string = 'Male',
    race: string = 'Human'
  ) => {
    axios
      .get(
        `/v1/generate_commoner?random_monster_gender=${gender}&random_monster_race=${race}`
      )
      .then((response) => {
        setMonster(response.data);
      });
  };

  const handleSetMonster = (monster: MonsterProps) => {
    setMonster(monster);
  };

  return (
    <PageContainer
      pageTitle={'Monster Generators and Converters'}
      description={
        'Several generators to build quick Monsters. Fields can be copied and pasted into Fantasy Grounds.'
      }
      breadcrumbs={[{ isActive: true, title: 'Monster Generator' }]}
    >
      <PageTitle title={'Monster Generators and Converters'} />
      <div>
        <p>
          Several generators to build quick Monsters. Fields can be copied and
          pasted into Fantasy Grounds.
        </p>

        {monster ? <MonsterDisplay monster={monster} shortDisplay /> : null}

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
                <GenerateCommoner onFormSubmit={handleGenerateCommoner} />
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
                <GenerateMonster setMonster={handleSetMonster} />
              </div>
            </div>
          </div>
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
                <Convert2eMonster />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default MonsterGenerator;
