import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import NPCDisplay from './NPCDisplay';
import GenerateNPC from './components/GenerateNPC';
import Convert2eNPC from './Convert2eNPC';
import GenerateCommoner from './components/GenerateCommoner';
import { GiBlacksmith, GiSpikedDragonHead, SiConvertio } from 'react-icons/all';
import axios from 'axios';
import { FlashMessage, MonsterProps, UserProps } from '../../utilities/types';

type NpcGeneratorProps = {
  user: UserProps;
  flashMessages?: [FlashMessage];
}

const NpcGenerator = (props: NpcGeneratorProps) => {
  const [monster, setMonster] = React.useState<MonsterProps | undefined>();

  const handleGenerateCommoner = (gender: string = 'Male', race: string = 'Human') => {
    axios.get(`/v1/generate_commoner?random_npc_gender=${gender}&random_npc_race=${race}`)
      .then((response) => {
        setMonster(response.data);
      });
  };

  const handleSetMonster = (monster: MonsterProps) => {
    setMonster(monster);
  };

  return (
    <PageContainer user={props.user}
                   flashMessages={props.flashMessages}
                   pageTitle={'NPC Generators and Converters'}
                   description={'Several generators to build quick Monsters. Fields can be copied and pasted into Fantasy Grounds.'}
                   breadcrumbs={[{ isActive: true, title: 'NPC Generator' }]}>
      <PageTitle title={'NPC Generators and Converters'} />
      <div>
        <p>
          Several generators to build quick NPCs. Fields can be copied and pasted into Fantasy Grounds.
        </p>

        {monster ? (
          <NPCDisplay npc={monster} shortDisplay />
        ) : null}

        <div className='accordion accordion-flush' id='npcGeneratorAccordion'>
          <div className='accordion-item'>
            <h3 className='accordion-header' id='commonerGeneratorHeading'>
              <button className='accordion-button collapsed'
                      type='button'
                      data-bs-toggle='collapse'
                      data-bs-target='#commonerGenerator'>
                <GiBlacksmith className={'me-2'} size={30} /> Commoner
              </button>
            </h3>
            <div id='commonerGenerator'
                 className='accordion-collapse collapse'
                 aria-labelledby='commonerGeneratorHeading'
                 data-bs-parent='#npcGeneratorAccordion'>
              <div className='accordion-body'>
                <GenerateCommoner onFormSubmit={handleGenerateCommoner} />
              </div>
            </div>
          </div>
          <div className='accordion-item'>
            <h3 className='accordion-header' id='monsterGeneratorHeading'>
              <button className='accordion-button collapsed'
                      type='button'
                      data-bs-toggle='collapse'
                      data-bs-target='#monsterGenerator'>
                <GiSpikedDragonHead className={'me-2'} size={30} />Generate NPC
              </button>
            </h3>
            <div id='monsterGenerator'
                 className='accordion-collapse collapse'
                 aria-labelledby='monsterGeneratorHeading'
                 data-bs-parent='#npcGeneratorAccordion'>
              <div className='accordion-body'>
                <GenerateNPC setMonster={handleSetMonster} />
              </div>
            </div>
          </div>
          <div className='accordion-item'>
            <h3 className='accordion-header' id='dnd2eGeneratorHeading'>
              <button className='accordion-button collapsed'
                      type='button'
                      data-bs-toggle='collapse'
                      data-bs-target='#dnd2eGenerator'>
                <SiConvertio className={'me-2'} size={30} />Convert 2nd Edition
              </button>
            </h3>
            <div id='dnd2eGenerator'
                 className='accordion-collapse collapse'
                 aria-labelledby='dnd2eGeneratorHeading'
                 data-bs-parent='#npcGeneratorAccordion'>
              <div className='accordion-body'>
                <Convert2eNPC />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );

};

export default NpcGenerator;

