import React from 'react';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import { fetchData } from '../../actions/api';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import { DndClass, IFlashMessage, IUser } from '../../utilities/types';
import { RouteComponentProps } from '@reach/router';

interface IDndClassPage {
  dndClass?: DndClass;
  dndClassSlug: string,
  flashMessages: [IFlashMessage];
  getDndClass: (dndClassSlug: string) => void;
  user: IUser,
}

const DndClass: React.FC<RouteComponentProps> = (props: IDndClassPage) => {
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

          </Col>
          <Col>
            <h2>Proficiencies</h2>
            <ListGroup>
              {dndClass.proficiencies.map((prof, index) => (
                <ListGroupItem key={index}>
                  <strong>{prof.name}</strong> - type: {prof.profType}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col>
            <h2>Proficiency Choices</h2>
            <ListGroup>
              {dndClass.proficiencyChoices.map((profChoice, index) => (
                <ListGroupItem key={index}>
                  <strong>Choose {profChoice.numChoices} from </strong>
                  <ListGroup>
                    {profChoice.proficiencies.map((prof, index) => (
                      <ListGroupItem key={index}>
                        <strong>{prof.name}</strong> - type: {prof.profType}
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
        </Row>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

export default DndClass;