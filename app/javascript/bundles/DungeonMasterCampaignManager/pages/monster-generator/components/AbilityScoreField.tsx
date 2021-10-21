/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi/';
import { UseFormRegister } from 'react-hook-form';
import { DiceRoll } from 'rpg-dice-roller';
import useSound from 'use-sound';
import {
  FieldValues,
  MonsterGeneratorFormFields,
} from '../../../utilities/types';
import FormField from '../../../components/forms/FormField';
import { Colors } from '../../../utilities/enums';
import Button from '../../../components/Button/Button';

const diceSound = require('../../../sounds/DiceRoll.mp3');

const styles = require('./ability-score-field.module.scss');

type AbilityScoreFieldProps = {
  name: keyof MonsterGeneratorFormFields;
  defaultValue?: any;
  infoText?: string;
  id?: string;
  label: string;
  readOnly?: boolean;
  hideRoll?: boolean;
  onChangeAbility: (name: string, value: string) => void;
  register: UseFormRegister<FieldValues>;
  value?: any;
};

const AbilityScoreField = (props: AbilityScoreFieldProps) => {
  const { label, name, hideRoll, onChangeAbility, register } = props;
  const [play] = useSound(diceSound, { volume: 0.5 });

  const handleRollAbility = (numDice: number = 3) => {
    const roll = new DiceRoll(`${numDice}d6dl1`);
    play();
    onChangeAbility(name, `${roll.total}`);
  };

  return (
    <div className={styles.abilityWrapper}>
      {hideRoll ? (
        <label className={styles.label}>{label}</label>
      ) : (
        <div className={styles.buttonGroup}>
          <Button
            color={Colors.warning}
            onClick={() => handleRollAbility()}
            title={`${label} 3d6`}
            icon={<GiDiceTwentyFacesTwenty />}
          />
          <Button
            color={Colors.info}
            onClick={() => handleRollAbility(4)}
            title={'4d6'}
            icon={<GiDiceTwentyFacesTwenty />}
          />
        </div>
      )}
      <div className={styles.abilityGroup}>
        <FormField
          className={styles.abilInput}
          label={label}
          name={name}
          type="number"
          register={register}
          onChange={onChangeAbility}
          hideLabel
        />
        <FormField
          className={styles.modField}
          label="Hit Dice Value"
          type="text"
          register={register}
          onChange={onChangeAbility}
          name={`${name}Mod`}
          hideLabel
          readOnly
        />
      </div>
    </div>
  );
};

export default AbilityScoreField;
