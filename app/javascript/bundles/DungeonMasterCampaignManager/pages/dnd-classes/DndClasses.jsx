import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {useTable} from 'react-table';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';

const DndClasses = (props) => {
  const {data, setData} = React.useState([]);
  React.useEffect(() => {
    const componentDidMount = () => {
      props.getDndClasses();
    };
    componentDidMount();
  }, []);

  React.useEffect(() => {
    setData(props.dndClasses);
  }, [props.dndClasses]);

  const columns = React.useMemo(() => [
    {
      Header: 'Class',
      accessor: 'name',
    },
    {
      Header: 'Hit Die',
      accessor: 'hitDie',
    },
  ]);

  // const columns = () => {
  //   return [{
  //     dataField: 'name',
  //     text: 'Class',
  //     sort: true,
  //     filter: textFilter(),
  //   }, {
  //     dataField: 'hitDie',
  //     text: 'Hit Dice',
  //     sort: true,
  //     formatter: DndClasses.hitDiceFormatter,
  //   }];
  // }

  // const hitDiceFormatter = (cell, row) => {
  //   if (row.hitDie) {
  //     return `d${ row.hitDie }`;
  //   }
  //   return 'N/A';
  // }
  //
  //
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
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });
  console.log(data);
  return (
    <PageContainer user={ props.user }
                   flashMessages={ props.flashMessages }
                   pageTitle={ 'DndClasses' }
                   description={ 'All D&D dndClasses. Dungeon Master\'s Toolbox is a free resource for DMs to manage their dndClasses, adventures, and NPCs.' }
                   breadcrumbs={ [{url: null, isActive: true, title: 'Character Classes'}] }>
      <PageTitle title={ 'Character Classes' }/>
      { props.dndClasses.dndClasses && props.dndClasses.dndClasses.length > 0 ? (
        <table { ...getTableProps() }>
          <thead>
            { headerGroups.map(headerGroup => (
              <tr { ...headerGroup.getHeaderGroupProps() }>
                { headerGroup.headers.map(column => (
                  <th { ...column.getHeaderProps() }>{ column.render('Header') }</th>
                )) }
              </tr>
            )) }
          </thead>
          <tbody { ...getTableBodyProps() }>
            { rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr { ...row.getRowProps() }>
                  { row.cells.map(cell => {
                    return <td { ...cell.getCellProps() }>{ cell.render('Cell') }</td>;
                  }) }
                </tr>
              );
            }) }
          </tbody>
        </table>
      ) : (
        <DndSpinner/>
      ) }
    </PageContainer>
  );
};

DndClasses.propTypes = {
  dndClasses: PropTypes.object,
  flashMessages: PropTypes.array,
  getDndClasses: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    dndClasses: state.dndClasses,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getDndClasses: () => {
      dispatch(rest.actions.getDndClasses());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DndClasses);