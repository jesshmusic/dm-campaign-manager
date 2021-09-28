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
  name: string,
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
                     name={`${action}.name`} />
          <FormField label={'Attack Bonus'}
                     className={styles.attackBonus}
                     register={register}
                     type={'text'}
                     readOnly
                     name={`${action}.attackBonus`} />
          <div className={styles.descContainer}>
            <div className={styles.radioContainer}>
              <div className='mr-eaves'>Action Type</div>
              <FormField label={'Normal'}
                         name={`${action}.actionType`}
                         register={register}
                         className='mb-0 me-2'
                         type={'radio'}
                         value={AttackType.normal} />
              <FormField label={'Multiattack'}
                         name={`${action}.actionType`}
                         register={register}
                         className='mb-0 me-2'
                         type={'radio'}
                         value={AttackType.multiattack} />
              <FormField label={'Custom'}
                         name={`${action}.actionType`}
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
                       name={`${action}.desc`} />
            <FormField label={'Number'}
                       type={'number'}
                       className={styles.infoFieldSm}
                       register={register}
                       required
                       name={`${action}.numberOfAttacks`} />
            <FormField label={'Description'}
                       className={styles.infoField}
                       type={'text'}
                       register={register}
                       readOnly
                       value={'Multiattack. Here is the de facto multiattack description'}
                       name={`${action}.desc`} />
            <FormField label={'Description'}
                       className={styles.infoField}
                       register={register}
                       type={'text'}
                       name={`${action}.desc`} />
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
                        countName={`${name}.diceCount`}
                        register={register}
                        dieName={`${name}.diceValue`} />
            <FormSelect label={'Damage Type'}
                        name={`${name}.damageType`}
                        className={styles.infoField}
                        options={damageTypes} />
            <FormField label={'Damage Bonus'}
                       type={'text'}
                       className={styles.infoField}
                       register={register}
                       readOnly
                       name={`${name}.damageBonus`} />
            <FormField label={'Additional Bonus'}
                       register={register}
                       type={'number'}
                       className={styles.infoField}
                       name={`${name}.addDamageBonus`} />
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