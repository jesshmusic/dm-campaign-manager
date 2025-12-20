import { TwoColumn } from './Widgets.styles';

const ActionsInCombat = () => {
  return (
    <TwoColumn>
      <div>
        <h4>Attack</h4>
        <h4>Cast a Spell</h4>
        <h4>Dash</h4>
        <h4>Disengage</h4>
        <h4>Dodge</h4>
        <h4>Help</h4>
      </div>
      <div>
        <h4>Hide</h4>
        <h4>Ready an Action</h4>
        <h4>Search</h4>
        <h4>Use a Magic Item</h4>
        <h4>Use an Object</h4>
        <h4>Use a Special Ability</h4>
      </div>
    </TwoColumn>
  );
};

export default ActionsInCombat;
