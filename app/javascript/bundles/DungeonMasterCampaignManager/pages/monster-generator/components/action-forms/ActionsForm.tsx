/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import { GiAbacus, GiSwordsPower } from 'react-icons/gi';
import {
  ActionTypes,
  MonsterGeneratorFormFields,
} from '../../../../utilities/types';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';

import '../../../../components/forms/inputOverrides.scss';
import ActionForm from './ActionForm';
import { abilityOptions } from './SpellcastingForm';
import { GiMagicPalm } from 'react-icons/all';

const styles = require('./action-form.module.scss');

const ActionsForm = (props: {
  fieldName: keyof MonsterGeneratorFormFields;
  title: string;
  singularTitle: string;
  useForm: UseFormReturn<any, object>;
}) => {
  const {
    fieldName,
    singularTitle,
    title,
    useForm: {
      control,
      formState: { errors },
      setValue,
      register,
      unregister,
      trigger,
    },
  } = props;
  const [hasSpellCasting, setHasSpellCasting] = React.useState(false);

  const isInitialRender = React.useRef(true);

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const actionNumber = (): string => {
    return fields.length > 0 ? ` ${fields.length}` : '';
  };

  const addAction = () => {
    append({
      name: `New Action${actionNumber()}`,
      desc: '',
      actionType: ActionTypes.ability,
    });
  };

  const addAttack = () => {
    append({
      name: `New Action${actionNumber()}`,
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
    append({
      name: `New Action${actionNumber()}`,
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
        spellIds: [],
      },
    });
  };

  React.useEffect(() => {
    if (!fields.length && !isInitialRender.current) {
      trigger(fieldName);
    }

    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [fields, register, setValue, unregister, trigger]);

  const handleRemove = (index: number) => {
    if (fields[index]['actionType'] === ActionTypes.spellCasting) {
      setHasSpellCasting(false);
    }
    remove(index);
  };

  return (
    <div className={styles.wrapper}>
      <h4>{title}</h4>
      {fields.map((action, actionIndex) => (
        <ActionForm
          key={action.id}
          actionIndex={actionIndex}
          control={control}
          errors={errors}
          remove={handleRemove}
        />
      ))}
      <Button
        type="button"
        onClick={addAction}
        color={Colors.success}
        icon={<GiAbacus size={30} />}
        title={`Add ${singularTitle}`}
      />
      <Button
        type="button"
        onClick={addAttack}
        color={Colors.danger}
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
    </div>
  );
};

export default ActionsForm;
