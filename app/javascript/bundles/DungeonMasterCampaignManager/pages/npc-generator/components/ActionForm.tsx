/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import { GiSwordsPower, GiTrashCan } from 'react-icons/gi';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import FormField from '../../../components/forms/FormField';
import FormContainer from '../../../containers/FormContainer';
import { NPCGeneratorFormFields } from '../../../utilities/types';
import { abilityScoreModifier } from '../../../utilities/character-utilities';
import DiceFields from './DiceFields';
import FormSelect from '../../../components/forms/FormSelect';
import { damageTypes } from '../services';

const styles = require('./action-form.module.scss');

enum AttackType {
  normal = 'normal',
  multiattack = 'multiattack',
  custom = 'custom'
}

const Condition = (props: { when: string, is: AttackType, children: React.ReactNode }) => (
  <Field name={props.when} subscription={{ value: true }}>
    {({ input: { value } }) => (value === props.is ? props.children : null)}
  </Field>
);

const ActionForm = (props: ({
  name: string,
  push: (name: string, object: {}) => void,
  title: string,
  singularTitle: string,
  values: NPCGeneratorFormFields
})) => {
  const { name, push, singularTitle, title, values } = props;
  return (
    <div className='mb-3'>
      <div className={styles.header}>
        <h4>{title}</h4>
        <button type='button'
                onClick={() => push(name, {
                  name: 'New Action',
                  actionType: AttackType.normal
                })}
                className={`btn btn-lg btn-success ${styles.addActionButton}`}>
          <GiTrashCan size={22} />
          <small>New {singularTitle}</small>
        </button>
      </div>
      <FieldArray name={name} className={'mb-3'}>
        {({ fields }) => (
          fields.map((action, index) => (
            !fields.value[index] || !fields.value[index]._destroy ? (
              <FormContainer columns={1} key={index}>
                <div className={styles.infoContainer}>
                  <FormField label={'Name*'}
                             type={'text'}
                             className={styles.infoField}
                             required
                             name={`${action}.name`} />
                  <FormField label={'Attack Bonus'}
                             className={styles.attackBonus}
                             type={'text'}
                             readOnly
                             name={`${action}.attackBonus`} />
                  <div className={styles.descContainer}>
                    <div className={styles.radioContainer}>
                      <div className='mr-eaves'>Action Type</div>
                      <FormField label={'Normal'}
                                 name={`${action}.actionType`}
                                 className='mb-0 me-2'
                                 type={'radio'}
                                 value={AttackType.normal} />
                      <FormField label={'Multiattack'}
                                 name={`${action}.actionType`}
                                 className='mb-0 me-2'
                                 type={'radio'}
                                 value={AttackType.multiattack} />
                      <FormField label={'Custom'}
                                 name={`${action}.actionType`}
                                 className='mb-0'
                                 type={'radio'}
                                 value={AttackType.custom} />
                    </div>
                    <Condition when={`${action}.actionType`} is={AttackType.normal}>
                      <FormField label={'Description'}
                                 className={styles.infoField}
                                 type={'text'}
                                 readOnly
                                 value={'Melee. Here is the de facto attack description'}
                                 name={`${action}.desc`} />
                    </Condition>
                    <Condition when={`${action}.actionType`} is={AttackType.multiattack}>
                      <FormField label={'Number'}
                                 type={'number'}
                                 className={styles.infoFieldSm}
                                 required
                                 name={`${action}.numberOfAttacks`} />
                      <FormField label={'Description'}
                                 className={styles.infoField}
                                 type={'text'}
                                 readOnly
                                 value={'Multiattack. Here is the de facto multiattack description'}
                                 name={`${action}.desc`} />
                    </Condition>
                    <Condition when={`${action}.actionType`} is={AttackType.custom}>
                      <FormField label={'Description'}
                                 className={styles.infoField}
                                 type={'text'}
                                 name={`${action}.desc`} />
                    </Condition>
                  </div>
                  <div className={styles.buttonContainer}>
                    <button type='button'
                            onClick={() => {
                              push(`${name}[${index}].damages`, {
                                addDamageBonus: 0,
                                damageBonus: abilityScoreModifier(values.strength ? values.strength : 10),
                                damageType: { label: 'Slashing', value: 'slashing' },
                                diceCount: 1,
                                diceValue: { label: 'd6', value: 6 }
                              });
                            }}
                            title='Add Damage'
                            className={`btn btn-lg btn-info ${styles.addDamageButton}`}>
                      <GiSwordsPower size={22} />
                      <small>Add Damage</small>
                    </button>
                  </div>
                  <div className={styles.buttonContainer}>
                    <button onClick={() => fields.remove(index)}
                            type='button'
                            className={`btn btn-lg btn-danger ${styles.addDamageButton}`}>
                      <GiTrashCan size={22} />
                      <small>Remove Action</small>
                    </button>
                  </div>
                </div>
                <FieldArray name={`${name}[${index}].damages`} className={'mb-3'}>
                  {({ fields }) => (
                    fields.map((name, damageIndex) => {
                      console.log(fields);
                      return (
                        <FormContainer columns={1} key={damageIndex} className='g-col-8'>
                          <div className={styles.damageContainer}>
                            <DiceFields className={styles.diceFields}
                                        countName={`${name}.diceCount`}
                                        dieName={`${name}.diceValue`} />
                            <FormSelect label={'Damage Type'}
                                        name={`${name}.damageType`}
                                        className={styles.infoField}
                                        value={fields.value[damageIndex].damageType}
                                        options={damageTypes} />
                            <FormField label={'Damage Bonus'}
                                       type={'text'}
                                       className={styles.infoField}
                                       readOnly
                                       name={`${name}.damageBonus`} />
                            <FormField label={'Additional Bonus'}
                                       type={'number'}
                                       className={styles.infoField}
                                       name={`${name}.addDamageBonus`} />
                            <div className={styles.buttonContainer}>
                              <button onClick={() => fields.remove(damageIndex)}
                                      title={'Remove'}
                                      className={`btn btn-lg btn-danger ${styles.addDamageButton}`}>
                                <GiTrashCan size={22} />
                                <small>Remove Damage</small>
                              </button>
                            </div>
                          </div>
                        </FormContainer>
                      );
                    })
                  )}
                </FieldArray>
              </FormContainer>
            ) : null
          ))
        )}
      </FieldArray>
    </div>
  );
};

export default ActionForm;