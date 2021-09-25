import ReactOnRails from 'react-on-rails';
import 'channels';
import $ from 'jquery';
import 'select2';
import 'bootstrap';
// import 'select2/dist/css/select2.css';
// import 'select2-bootstrap-5-theme/dist/select2-bootstrap-5-theme.min.css';

require('@nathanvda/cocoon');

$(document).ready(() => {
  $('#monster_condition_ids').select2({
    theme: 'bootstrap-5'
  });
  $('#prof_choices_container').on('cocoon:after-insert', () => {
    loadSelect2();
  });
  $('#spell_components').select2({
    theme: 'bootstrap-5'
  });
  $('#spell_dnd_class_ids').select2({
    theme: 'bootstrap-5'
  });
  $('#dnd_class_ability_score_ids').select2({
    theme: 'bootstrap-5'
  });

  // $('#monster_damage_vulnerabilities').select2({
  //   tags: true,
  //   theme: 'bootstrap-5'
  // });
  //
  // $('#monster_damage_immunities').select2({
  //   tags: true,
  //   theme: 'bootstrap-5'
  // });
  //
  // $('#monster_damage_resistances').select2({
  //   tags: true,
  //   theme: 'bootstrap-5'
  // });

  function loadSelect2 () {
    $('#dnd_class_spell_ids').select2({
      theme: 'bootstrap-5'
    });
    $('#dnd_class_prof_ids').select2({
      theme: 'bootstrap-5'
    });
    $('.prof_choice_profs').select2({
      theme: 'bootstrap-5'
    });
  }

  loadSelect2();

  const itemCategory = $('#item_category');
  itemCategory.select2({ theme: 'bootstrap-5' });

  const $eventSelect = itemCategory;

  $eventSelect.select2();

  $eventSelect.on('select2:select', (event) => {
    handleSelectOptionType(event.params.data.text);
  });

  function handleSelectOptionType (selectValue) {
    hideAllInputs();
    if (selectValue === 'Armor') {
      $('#armorFields').show();
    } else if (selectValue === 'Mounts and Vehicles') {
      $('#vehicleFields').show();
    } else if (selectValue === 'Weapon') {
      $('#weaponFields').show();
    }
  }

  function hideAllInputs () {
    $('#armorFields').hide();
    $('#vehicleFields').hide();
    $('#weaponFields').hide();
  }

  hideAllInputs();
  handleSelectOptionType(itemCategory.text());
});

import Home from '../bundles/DungeonMasterCampaignManager/pages/Home';

// This is how react_on_rails can see the Home in the browser.
ReactOnRails.register({
  Home
});
