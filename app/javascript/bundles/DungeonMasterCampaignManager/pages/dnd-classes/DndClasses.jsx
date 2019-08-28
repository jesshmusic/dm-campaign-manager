import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@reach/router';
import BreadcrumbLink from '../../components/layout/BreadcrumbLink';

const ReactMarkdown = require('react-markdown');


// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';
import ListGroup from 'react-bootstrap/ListGroup';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

class DndClasses extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getDndClasses();
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
          <div>
            <h2>D&D Classes</h2>
            <ListGroup>
              {this.props.dndClasses.dndClasses.map((dndClass) =>
                <ListGroup.Item key={dndClass.slug}>
                  <Link to={`/app/classes/${dndClass.slug}`}>
                    {dndClass.name}
                  </Link>
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>
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