import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import NPCDisplay from './NPCDisplay';
import GenerateNPC from './GenerateNPC';
import Col from 'react-bootstrap/Col';
import Convert2eNPC from './Convert2eNPC';
import Accordion from 'react-bootstrap/Accordion';
import GenerateCommoner from '../npcs/partials/GenerateCommoner';
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
                   breadcrumbs={[{ url: null, isActive: true, title: 'NPC Generator' }]}>
      <Container fluid>
        <PageTitle title={'NPC Generators and Converters'} />
        <Row>
          <Col sm={12}>
            <p>
              Several generators to build quick NPCs. Fields can be copied and pasted into Fantasy Grounds.
            </p>

            {monster ? (
              <NPCDisplay npc={monster} shortDisplay />
            ) : null}
            <Accordion defaultActiveKey='0' flush>
              <Accordion.Item eventKey={'0'}>
                <Accordion.Header><GiBlacksmith className={'me-2'} size={30} />Commoner</Accordion.Header>
                <Accordion.Body>
                  <GenerateCommoner onFormSubmit={handleGenerateCommoner} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey={'1'}>
                <Accordion.Header><GiSpikedDragonHead className={'me-2'} size={30} />Generate NPC</Accordion.Header>
                <Accordion.Body>
                  <GenerateNPC setMonster={handleSetMonster} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey={'2'}>
                <Accordion.Header><SiConvertio className={'me-2'} size={30} />Convert 2nd Edition</Accordion.Header>
                <Accordion.Body>
                  <Convert2eNPC />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </PageContainer>
  );
};

export default NpcGenerator;

