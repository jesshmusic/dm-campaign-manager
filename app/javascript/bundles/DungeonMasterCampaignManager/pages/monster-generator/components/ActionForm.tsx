/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import { GiSwordsPower, GiTrashCan } from 'react-icons/gi';
// import { Field } from 'react-final-form';
// import { FieldArray } from 'react-final-form-arrays';
import FormField from '../../../components/forms/FormField';
import FormContainer from '../../../containers/FormContainer';
import {
  FieldValues,
  MonsterGeneratorFormFields,
} from '../../../utilities/types';
import DiceFields from './DiceFields';
import FormSelect from '../../../components/forms/FormSelect';
import { damageTypes } from '../services';
import { UseFormRegister } from 'react-hook-form';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';

const styles = require('./action-form.module.scss');

enum AttackType {
  normal = 'normal',
  multiattack = 'multiattack',
  custom = 'custom',
}

const ActionForm = (props: {
  name: keyof MonsterGeneratorFormFields;
  title: string;
  singularTitle: string;
  register: UseFormRegister<FieldValues>;
}) => {
  const { name, register, singularTitle, title } = props;
  const action = 'TEMP';
  return (
    <div className="mb-3">
      <div className={styles.header}>
        <h4>{title}</h4>
        <Button
          color={Colors.success}
          title={`New ${singularTitle}`}
          onClick={() => {}}
          icon={<GiTrashCan size={22} />}
        />
      </div>
      <FormContainer columns={1}>
        <div className={styles.infoContainer}>
          <FormField
            label={'Name*'}
            type={'text'}
            className={styles.infoField}
            register={register}
            required
            name={`${action}.name` as keyof MonsterGeneratorFormFields}
          />
          <FormField
            label={'Attack Bonus'}
            className={styles.attackBonus}
            register={register}
            type={'text'}
            readOnly
            name={`${action}.attackBonus` as keyof MonsterGeneratorFormFields}
          />
          <div className={styles.descContainer}>
            <div className={styles.radioContainer}>
              <div className="mr-eaves">Action Type</div>
              <FormField
                label={'Normal'}
                name={
                  `${action}.actionType` as keyof MonsterGeneratorFormFields
                }
                register={register}
                className="mb-0 me-2"
                type={'radio'}
                value={AttackType.normal}
              />
              <FormField
                label={'Multiattack'}
                name={
                  `${action}.actionType` as keyof MonsterGeneratorFormFields
                }
                register={register}
                className="mb-0 me-2"
                type={'radio'}
                value={AttackType.multiattack}
              />
              <FormField
                label={'Custom'}
                name={
                  `${action}.actionType` as keyof MonsterGeneratorFormFields
                }
                register={register}
                className="mb-0"
                type={'radio'}
                value={AttackType.custom}
              />
            </div>
            <FormField
              label={'Description'}
              className={styles.infoField}
              type={'text'}
              register={register}
              readOnly
              value={'Melee. Here is the de facto attack description'}
              name={`${action}.desc` as keyof MonsterGeneratorFormFields}
            />
            <FormField
              label={'Number'}
              type={'number'}
              className={styles.infoFieldSm}
              register={register}
              required
              name={
                `${action}.numberOfAttacks` as keyof MonsterGeneratorFormFields
              }
            />
            <FormField
              label={'Description'}
              className={styles.infoField}
              type={'text'}
              register={register}
              readOnly
              value={
                'Multiattack. Here is the de facto multiattack description'
              }
              name={`${action}.desc` as keyof MonsterGeneratorFormFields}
            />
            <FormField
              label={'Description'}
              className={styles.infoField}
              register={register}
              type={'text'}
              name={`${action}.desc` as keyof MonsterGeneratorFormFields}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Button
              color={Colors.info}
              title="Add Damage"
              onClick={() => {}}
              icon={<GiSwordsPower size={22} />}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Button
              color={Colors.danger}
              title="Remove Action"
              onClick={() => {}}
              icon={<GiTrashCan size={22} />}
            />
          </div>
        </div>
        <FormContainer columns={1} className="g-col-8">
          <div className={styles.damageContainer}>
            <DiceFields
              className={styles.diceFields}
              countName={
                `${name}.diceCount` as keyof MonsterGeneratorFormFields
              }
              register={register}
              dieName={`${name}.diceValue` as keyof MonsterGeneratorFormFields}
            />
            <FormSelect
              label={'Damage Type'}
              name={`${name}.damageType` as keyof MonsterGeneratorFormFields}
              className={styles.infoField}
              options={damageTypes}
            />
            <FormField
              label={'Damage Bonus'}
              type={'text'}
              className={styles.infoField}
              register={register}
              readOnly
              name={`${name}.damageBonus` as keyof MonsterGeneratorFormFields}
            />
            <FormField
              label={'Additional Bonus'}
              register={register}
              type={'number'}
              className={styles.infoField}
              name={
                `${name}.addDamageBonus` as keyof MonsterGeneratorFormFields
              }
            />
            <div className={styles.buttonContainer}>
              <Button
                color={Colors.danger}
                title="Remove Damage"
                onClick={() => {}}
                icon={<GiTrashCan size={22} />}
              />
            </div>
          </div>
        </FormContainer>
      </FormContainer>
    </div>
  );
};

export default ActionForm;
