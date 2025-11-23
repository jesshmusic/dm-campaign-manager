import ReactOnRails from 'react-on-rails';
import 'channels';
import 'bootstrap';
import '@nathanvda/cocoon';

import App from '../bundles/DungeonMasterCampaignManager/App';
import FoundryMapsAdmin from '../bundles/DungeonMasterCampaignManager/pages/FoundryMapsAdmin';

// This is how react_on_rails can see the App in the browser.
ReactOnRails.register({
  App,
  FoundryMapsAdmin,
});
