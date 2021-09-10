import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';
import ListGroup from 'react-bootstrap/ListGroup';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Col from 'react-bootstrap/Col';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';

class DndClasses extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getDndClasses();
  }

  get columns () {
    return [{
      dataField: 'name',
      text: 'Class',
      sort: true,
      filter: textFilter(),
    }, {
      dataField: 'hitDie',
      text: 'Hit Dice',
      sort: true,
      formatter: DndClasses.hitDiceFormatter,
    }];
  }

  static hitDiceFormatter (cell, row) {
    if (row.hitDie) {
      return `d${row.hitDie}`;
    }
    return 'N/A';
  }

  get expandRow () {
    return {
      parentClassName: 'table-primary',
      onlyOneExpanding: true,
      renderer: (row) => (
        <Container>
          <Row>
            <Col>
              <h2>Class Features</h2>
              <ListGroup>
                <ListGroupItem>
                  <strong>Hit Dice</strong> 1d{row.hitDie} per {row.name} level
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Primary {row.primaryAbilities.length > 1 ? 'Abilities' : 'Ability'}</strong> {row.primaryAbilities.join(', ')}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Saving Throw{row.savingThrowAbilities.length > 1 ? 's ' : ' '}</strong> {row.savingThrowAbilities.join(', ')}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>Proficiencies</h3>
              <ListGroup>
                {row.proficiencies.map((prof, index) => (
                  <ListGroupItem key={index}>
                    <strong>{prof.name}</strong> - type: {prof.profType}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>
            <Col>
              <h3>Proficiency Choices</h3>
              <ListGroup>
                {row.proficiencyChoices.map((profChoice, index) => (
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
        </Container>
      ),
    };
  }

  render () {
    return (
      <PageContainer user={this.props.user}
                     flashMessages={this.props.flashMessages}
                     pageTitle={'DndClasses'}
                     description={'All D&D dndClasses. Dungeon Master\'s Toolbox is a free resource for DMs to manage their dndClasses, adventures, and NPCs.'}
                     breadcrumbs={[{url: null, isActive: true, title: 'Character Classes'}]}>
        <PageTitle title={'Character Classes'}/>
        {this.props.dndClasses.dndClasses && this.props.dndClasses.dndClasses.length > 0 ? (
          <BootstrapTable keyField='id'
                          data={ this.props.dndClasses.dndClasses }
                          columns={ this.columns }
                          bootstrap4
                          hover
                          filter={ filterFactory() }
                          pagination={ paginationFactory() }
                          expandRow={ this.expandRow } />
        ) : (
          <DndSpinner/>
        )}
      </PageContainer>
    );
  }
}

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