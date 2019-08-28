import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BreadcrumbLink from '../../components/layout/BreadcrumbLink';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';
import ListGroup from 'react-bootstrap/ListGroup';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

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
              <h2>Proficiencies</h2>
              <ListGroup>
                {row.proficiencies.map((prof, index) => (
                  <ListGroupItem key={index}>
                    <strong>{prof.name}</strong> - type: {prof.profType}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>
            <Col>
              <h2>Proficiency Choices</h2>
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
                     description={'All D&D dndClasses. Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their dndClasses, adventures, and NPCs.'}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'} />
            <Breadcrumb.Item active>DndClasses</Breadcrumb.Item>
          </Breadcrumb>
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
            <Spinner animation="border" variant="primary" />
          )}
        </div>
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