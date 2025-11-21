/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import { GiAbacus, GiSwordsPower } from 'react-icons/gi';
import { ActionFormComponentProps, ActionTypes } from '../../../../../../../utilities/types';
import Button from '../../../../../../../components/Button/Button';
import { Colors } from '../../../../../../../utilities/enums';

import '../../../../../../../components/forms/inputOverrides.scss';
import ActionForm from './ActionForm';
import { abilityOptions } from './SpellcastingForm';
import { GiMagicPalm } from 'react-icons/all';

const ActionsForm = (props: ActionFormComponentProps) => {
  const {
    appendAction,
    fieldName,
    fields,
    handleRemove,
    singularTitle,
    useForm: {
      control,
      formState: { errors },
    },
  } = props;
  const [hasSpellCasting, setHasSpellCasting] = React.useState(false);

  const handleRemoveBasicAction = (index: number) => {
    if (fields[index]['actionType'] === ActionTypes.spellCasting) {
      setHasSpellCasting(false);
    }
    handleRemove(index);
  };

  const addAction = () => {
    appendAction({
      desc: '',
      actionType: ActionTypes.ability,
    });
  };

  const addAttack = () => {
    appendAction({
      actionType: ActionTypes.attack,
      numAttacks: 1,
      desc: '',
      damage: {
        damageTypeOption: { label: 'Slashing', value: 'slashing' },
        damageType: 'slashing',
        diceValueOption: { label: 'd6', value: 6 },
        diceValue: 6,
        isRanged: false,
        numDice: 1,
        numTargets: 1,
        rangeNormal: 120,
        rangeLong: 300,
        reach: 5,
      },
    });
  };

  const addSpellCasting = () => {
    setHasSpellCasting(true);
    appendAction({
      name: `Spellcasting`,
      actionType: ActionTypes.spellCasting,
      desc: '',
      spellCasting: {
        level: 1,
        ability: 'Intelligence',
        abilityOption: abilityOptions[3],
        slots: {
          first: 0,
          second: 0,
          third: 0,
          fourth: 0,
          fifth: 0,
          sixth: 0,
          seventh: 0,
          eighth: 0,
          ninth: 0,
        },
        spellOptions: [],
      },
    });
  };

  return (
    <>
      {fields.map((action, actionIndex) => (
        <ActionForm
          key={action.id}
          actionIndex={actionIndex}
          control={control}
          errors={errors}
          fieldName={fieldName}
          remove={handleRemoveBasicAction}
        />
      ))}
      <Button
        type="button"
        onClick={addAction}
        color={Colors.primary}
        icon={<GiAbacus size={30} />}
        title={`Add ${singularTitle}`}
      />
      <Button
        type="button"
        onClick={addAttack}
        color={Colors.secondary}
        icon={<GiSwordsPower size={30} />}
        title={'Add Attack'}
      />
      {!hasSpellCasting && (
        <Button
          type="button"
          onClick={addSpellCasting}
          color={Colors.info}
          icon={<GiMagicPalm size={30} />}
          title={'Add Spellcasting'}
        />
      )}
    </>
  );
};

export default ActionsForm;
