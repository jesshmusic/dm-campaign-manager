import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';
import CampaignsList from './partials/CampaignsList';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';

class Campaigns extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    if (this.props.user) {
      this.props.getCampaigns(this.props.user.id);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  render () {
    const { campaigns, loading, user, flashMessages } = this.props;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={'Campaigns'}
                     description={'All D&D campaigns. Dungeon Master\'s Toolbox is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}
                     breadcrumbs={[{url: null, isActive: true, title: 'Campaigns'}]}>
        <PageTitle title={'My Campaigns'}
                   hasButton={user !== null}
                   buttonLink={'/app/campaigns/new/'}
                   buttonTitle={'Add Campaign'}
                   buttonVariant={'success'}/>
        {loading ? (
          <DndSpinner/>
        ) : (
          <CampaignsList campaigns={campaigns} user={user}/>
        )}
      </PageContainer>
    );
  }
}

Campaigns.propTypes = {
  campaigns: PropTypes.object,
  flashMessages: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns.campaigns,
    loading: state.campaigns.loading,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getCampaigns: (user_id) => {
      dispatch(rest.actions.getCampaigns({user_id}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns);