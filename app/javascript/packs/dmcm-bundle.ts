import ReactOnRails from 'react-on-rails';
import 'channels';
import 'bootstrap';

require('@nathanvda/cocoon');

import Home from '../bundles/DungeonMasterCampaignManager/pages/Home';

// This is how react_on_rails can see the Home in the browser.
ReactOnRails.register({
  Home,
});
