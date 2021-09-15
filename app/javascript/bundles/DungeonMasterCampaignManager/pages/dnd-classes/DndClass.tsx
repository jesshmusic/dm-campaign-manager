import React from 'react';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import { fetchData } from '../../actions/api';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import { DndClass, PageProps } from '../../utilities/types';

type DndClassPageProps = {
  dndClass?: DndClass;
  dndClassSlug: string,
  getDndClass: (dndClassSlug: string) => void;
} & PageProps;

const DndClass = (props: DndClassPageProps) => {
  const [dndClass, setDndClass] = React.useState<DndClass | undefined>();
  const { user, flashMessages, dndClassSlug } = props;

  React.useEffect(() => {
    const componentDidMount = async () => {
      const response = await fetchData({
        method: 'get',
        url: `/v1/dnd_classes/${dndClassSlug}.json`
      });
      setDndClass(response.data);
    };
    componentDidMount();
  }, []);

  const dndClassTitle = dndClass ? dndClass.name : 'Class Loading...';

  return (
    <PageContainer user={user}
                   flashMessages={flashMessages}
                   pageTitle={dndClassTitle}
                   description={`DndClass: ${dndClassTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and NPCs.`}
                   breadcrumbs={[{ url: '/app/classes', isActive: false, title: 'Character Classes' },
                     { url: null, isActive: true, title: dndClassTitle }]}>
      <PageTitle title={`Class: ${dndClassTitle}`} />
      {dndClass ? (
        <Row>
          <Col>
            <Row>
              <Col className={'table-frame'}>
                <h2 className={'h3 mr-eaves'}>Info</h2>
                <Row className={'sans-serif'}>
                  <Col>
                    <h3 className={'h5'}>Hit Die: d{dndClass.hitDie}</h3>
                    <p>
                      <strong>Primary Abilities: </strong>
                      {
                        dndClass.abilityScores
                          .map<React.ReactNode>((ability) => (<span key={ability.name}>{ability.fullName}</span>))
                          .reduce((prev, curr) => [prev, ', ', curr])
                      }
                    </p>
                    <p>
                      <strong>Subclasses: </strong>
                      {dndClass.subclasses.join(', ')}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div>
                      <h3 className={'h5'}>Starting Equipment: </h3>
                      {
                        dndClass.startingEquipment
                          .map<React.ReactNode>((item) => (
                            <p key={item.name}>{item.quantity} {item.name}</p>
                          ))
                      }
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <h3 className={'h5'}>Equipment Options: </h3>
                      {
                        dndClass.startingEquipment
                          .map<React.ReactNode>((item) => (
                            <p key={item.name}>{item.quantity} {item.name}</p>
                          ))
                      }
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className={'table-frame'}>
              <Col>
                <h2 className={'h3'}>Proficiencies</h2>
                {dndClass.proficiencies.map((prof, index) => (
                  <p key={index}>
                    <strong>{prof.name}</strong> {prof.profType}
                  </p>
                ))}
              </Col>
              <Col>
                <h2 className={'h3 mb-0'}>Proficiency Choices</h2>
                <Row className={'pt-0'}>
                  {dndClass.proficiencyChoices.map((profChoice, index) => (
                    <Col key={index}>
                      <h3 className={'h4'}>Choose {profChoice.numChoices} from </h3>
                      {profChoice.proficiencies.map((prof, index) => (
                        <p key={index}>
                          <strong>{prof.name}</strong> {prof.profType}
                        </p>
                      ))}
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col className={'table-frame'}>
                <h2 className={'h3 mr-eaves'}>Multi-classing</h2>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

export default DndClass;