import ReactOnRails from 'react-on-rails';
import 'channels';
import 'bootstrap';

require('@nathanvda/cocoon');

import App from '../bundles/DungeonMasterCampaignManager/App';

// This is how react_on_rails can see the App in the browser.
ReactOnRails.register({
  App,
});
