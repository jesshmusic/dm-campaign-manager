import { UseFormReturn } from 'react-hook-form';
import { ActionTypes, MonsterActionField } from '../../../utilities/types';
import ActionsTable from './ActionsTable';
import ActionForm from '../../monster-generator/components/generate-monster/sections/actions/action-forms/ActionForm';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { GiSave } from 'react-icons/all';
import React from 'react';
import FormSelect from '../../../components/forms/FormSelect';
import { actionTypeOptions } from '../../../utilities/character-utilities';

const styles = require('../admin-dashboard.module.scss');

const CustomActions = (props: {
  useForm: UseFormReturn<{ action: MonsterActionField; actionType: ActionTypes }, object>;
  onSubmitActionForm: (data: { action: MonsterActionField; actionType: ActionTypes }) => void;
}) => {
  return (
    <>
      <h3>Create New Action</h3>

      <form
        onSubmit={props.useForm.handleSubmit(props.onSubmitActionForm)}
        className={styles.genForm}
        noValidate
      >
        <div className={styles.actionTypeContainer}>
          <FormSelect
            label={'Action Type'}
            control={props.useForm.control}
            options={actionTypeOptions}
            name={'actionTypeOption'}
          />
        </div>
        <ActionForm
          control={props.useForm.control}
          errors={props.useForm.formState.errors}
          fieldName={'action'}
        />
        <Button type="submit" color={Colors.success} icon={<GiSave size={30} />} title="Save" />
      </form>
      <h3>All Custom Actions</h3>
      <ActionsTable />
    </>
  );
};

export default CustomActions;
