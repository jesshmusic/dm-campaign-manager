/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import { GiSwordsPower, GiTrashCan } from 'react-icons/gi';
// import { Field } from 'react-final-form';
// import { FieldArray } from 'react-final-form-arrays';
import FormField from '../../../components/forms/FormField';
import FormContainer from '../../../containers/FormContainer';
import { FieldValues, NPCGeneratorFormFields } from '../../../utilities/types';
import { abilityScoreModifier } from '../../../utilities/character-utilities';
import DiceFields from './DiceFields';
import FormSelect from '../../../components/forms/FormSelect';
import { damageTypes } from '../services';
import { UseFormRegister } from 'react-hook-form';

const styles = require('./action-form.module.scss');

enum AttackType {
  normal = 'normal',
  multiattack = 'multiattack',
  custom = 'custom'
}

const ActionForm = (props: ({
  name: keyof NPCGeneratorFormFields,
  title: string,
  singularTitle: string,
  register: UseFormRegister<FieldValues>
})) => {
  const { name, register, singularTitle, title } = props;
  const action = 'TEMP';
  return (
    <div className='mb-3'>
      <div className={styles.header}>
        <h4>{title}</h4>
        <button type='button'
          // onClick={() => push(name, {
          //   name: 'New Action',
          //   actionType: AttackType.normal
          // })}
                className={`btn btn-lg btn-success ${styles.addActionButton}`}>
          <GiTrashCan size={22} />
          <small>New {singularTitle}</small>
        </button>
      </div>
      <FormContainer columns={1}>
        <div className={styles.infoContainer}>
          <FormField label={'Name*'}
                     type={'text'}
                     className={styles.infoField}
                     register={register}
                     required
                     name={`${action}.name` as keyof NPCGeneratorFormFields} />
          <FormField label={'Attack Bonus'}
                     className={styles.attackBonus}
                     register={register}
                     type={'text'}
                     readOnly
                     name={`${action}.attackBonus` as keyof NPCGeneratorFormFields} />
          <div className={styles.descContainer}>
            <div className={styles.radioContainer}>
              <div className='mr-eaves'>Action Type</div>
              <FormField label={'Normal'}
                         name={`${action}.actionType` as keyof NPCGeneratorFormFields}
                         register={register}
                         className='mb-0 me-2'
                         type={'radio'}
                         value={AttackType.normal} />
              <FormField label={'Multiattack'}
                         name={`${action}.actionType` as keyof NPCGeneratorFormFields}
                         register={register}
                         className='mb-0 me-2'
                         type={'radio'}
                         value={AttackType.multiattack} />
              <FormField label={'Custom'}
                         name={`${action}.actionType` as keyof NPCGeneratorFormFields}
                         register={register}
                         className='mb-0'
                         type={'radio'}
                         value={AttackType.custom} />
            </div>
            <FormField label={'Description'}
                       className={styles.infoField}
                       type={'text'}
                       register={register}
                       readOnly
                       value={'Melee. Here is the de facto attack description'}
                       name={`${action}.desc` as keyof NPCGeneratorFormFields} />
            <FormField label={'Number'}
                       type={'number'}
                       className={styles.infoFieldSm}
                       register={register}
                       required
                       name={`${action}.numberOfAttacks` as keyof NPCGeneratorFormFields} />
            <FormField label={'Description'}
                       className={styles.infoField}
                       type={'text'}
                       register={register}
                       readOnly
                       value={'Multiattack. Here is the de facto multiattack description'}
                       name={`${action}.desc` as keyof NPCGeneratorFormFields} />
            <FormField label={'Description'}
                       className={styles.infoField}
                       register={register}
                       type={'text'}
                       name={`${action}.desc` as keyof NPCGeneratorFormFields} />
          </div>
          <div className={styles.buttonContainer}>
            <button type='button'
                    onClick={() => {
                      // push(`${name}[${index}].damages`, {
                      //   addDamageBonus: 0,
                      //   damageBonus: abilityScoreModifier(values.strength ? values.strength : 10),
                      //   damageType: { label: 'Slashing', value: 'slashing' },
                      //   diceCount: 1,
                      //   diceValue: { label: 'd6', value: 6 }
                      // });
                    }}
                    title='Add Damage'
                    className={`btn btn-lg btn-info ${styles.addDamageButton}`}>
              <GiSwordsPower size={22} />
              <small>Add Damage</small>
            </button>
          </div>
          <div className={styles.buttonContainer}>
            <button type='button'
                    onClick={() => {
                    }}
                    className={`btn btn-lg btn-danger ${styles.addDamageButton}`}>
              <GiTrashCan size={22} />
              <small>Remove Action</small>
            </button>
          </div>
        </div>
        <FormContainer columns={1} className='g-col-8'>
          <div className={styles.damageContainer}>
            <DiceFields className={styles.diceFields}
                        countName={`${name}.diceCount` as keyof NPCGeneratorFormFields}
                        register={register}
                        dieName={`${name}.diceValue` as keyof NPCGeneratorFormFields} />
            <FormSelect label={'Damage Type'}
                        name={`${name}.damageType` as keyof NPCGeneratorFormFields}
                        className={styles.infoField}
                        options={damageTypes} />
            <FormField label={'Damage Bonus'}
                       type={'text'}
                       className={styles.infoField}
                       register={register}
                       readOnly
                       name={`${name}.damageBonus` as keyof NPCGeneratorFormFields} />
            <FormField label={'Additional Bonus'}
                       register={register}
                       type={'number'}
                       className={styles.infoField}
                       name={`${name}.addDamageBonus` as keyof NPCGeneratorFormFields} />
            <div className={styles.buttonContainer}>
              <button title={'Remove'}
                      onClick={() => true}
                      className={`btn btn-lg btn-danger ${styles.addDamageButton}`}>
                <GiTrashCan size={22} />
                <small>Remove Damage</small>
              </button>
            </div>
          </div>
        </FormContainer>
      </FormContainer>
    </div>
  );
};

export default ActionForm;