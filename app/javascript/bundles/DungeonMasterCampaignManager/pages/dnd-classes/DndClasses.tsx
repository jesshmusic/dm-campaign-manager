import React from 'react';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import {fetchData} from '../../actions/api';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import DataTable from '../../components/layout/DataTable';
import {RouteComponentProps} from "@reach/router";
import {IDndClass, IDndClasses, IFlashMessage, IUser} from "../../utilities/types";


interface IDndClassesPage {
  dndClasses?: IDndClasses;
  dndClassSlug: string,
  flashMessages: [IFlashMessage];
  getDndClasses: () => void;
  user: IUser,
}

const DndClasses: React.FC<RouteComponentProps> = (props: IDndClassesPage) => {
  const [dndClasses, setDndClasses] = React.useState([]);

  React.useEffect(() => {
    const componentDidMount = async () => {
      const response = await fetchData({
        method: 'get',
        url: '/v1/dnd_classes.json'
      });
      setDndClasses(response.data?.results);
    }
    componentDidMount();
  }, []);

  const data = React.useMemo(() => {
    console.log(dndClasses);
    return dndClasses.map((dndClass: IDndClass) => {
      return {
        name: dndClass.name,
        hitDie: `d${dndClass.hitDie}`,
      };
    });
  }, [dndClasses]);

  const columns = React.useMemo(() => [
    {
      Header: 'Class',
      accessor: 'name',
    },
    {
      Header: 'Hit Die',
      accessor: 'hitDie',
    },
  ], []);


  return (
    <PageContainer user={props.user}
                   flashMessages={props.flashMessages}
                   pageTitle={'DndClasses'}
                   description={'All D&D dndClasses. Dungeon Master\'s Toolbox is a free resource for DMs to manage their dndClasses, adventures, and NPCs.'}
                   breadcrumbs={[{url: null, isActive: true, title: 'Character Classes'}]}>
      <PageTitle title={'Character Classes'}/>
      {dndClasses.length > 0 ? (
        <DataTable columns={columns} data={data}/>
      ) : (
        <DndSpinner/>
      )}
    </PageContainer>
  );
};

export default DndClasses;

// function mapStateToProps(state) {
//   return {
//     dndClasses: state.dndClasses,
//     user: state.users.user,
//     flashMessages: state.flashMessages,
//   };
// }
//
// function mapDispatchToProps(dispatch) {
//   return {
//     getDndClasses: () => {
//       dispatch(rest.actions.getDndClasses());
//     },
//   };
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(DndClasses);


// const expandRow = () => {
//   return {
//     parentClassName: 'table-primary',
//     onlyOneExpanding: true,
//     renderer: (row) => (
//       <Container>
//         <Row>
//           <Col>
//             <h2>Class Features</h2>
//             <ListGroup>
//               <ListGroupItem>
//                 <strong>Hit Dice</strong> 1d{ row.hitDie } per { row.name } level
//               </ListGroupItem>
//               <ListGroupItem>
//                 <strong>Primary { row.primaryAbilities.length > 1 ? 'Abilities' : 'Ability' }</strong> { row.primaryAbilities.join(', ') }
//               </ListGroupItem>
//               <ListGroupItem>
//                 <strong>Saving
//                   Throw{ row.savingThrowAbilities.length > 1 ? 's ' : ' ' }</strong> { row.savingThrowAbilities.join(', ') }
//               </ListGroupItem>
//             </ListGroup>
//           </Col>
//         </Row>
//         <Row>
//           <Col>
//             <h3>Proficiencies</h3>
//             <ListGroup>
//               { row.proficiencies.map((prof, index) => (
//                 <ListGroupItem key={ index }>
//                   <strong>{ prof.name }</strong> - type: { prof.profType }
//                 </ListGroupItem>
//               )) }
//             </ListGroup>
//           </Col>
//           <Col>
//             <h3>Proficiency Choices</h3>
//             <ListGroup>
//               { row.proficiencyChoices.map((profChoice, index) => (
//                 <ListGroupItem key={ index }>
//                   <strong>Choose { profChoice.numChoices } from </strong>
//                   <ListGroup>
//                     { profChoice.proficiencies.map((prof, index) => (
//                       <ListGroupItem key={ index }>
//                         <strong>{ prof.name }</strong> - type: { prof.profType }
//                       </ListGroupItem>
//                     )) }
//                   </ListGroup>
//                 </ListGroupItem>
//               )) }
//             </ListGroup>
//           </Col>
//         </Row>
//       </Container>
//     ),
//   };
// }