import { UseFormReturn } from 'react-hook-form';
import { ActionTypes, MonsterActionField } from '../../../utilities/types';
import ActionsTable from './ActionsTable';
import ActionForm from '../../monster-generator/components/generate-monster/sections/actions/action-forms/ActionForm';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { GiSave } from 'react-icons/all';
import React from 'react';

const styles = require('../admin-dashboard.module.scss');

const CustomActions = (props: {
  useForm: UseFormReturn<{ action: MonsterActionField; actionType: ActionTypes }, object>;
  onSubmitActionForm: (data: { action: MonsterActionField; actionType: ActionTypes }) => void;
}) => {
  return (
    <>
      <ActionsTable />
      <h3>Create New Action</h3>
      <form
        onSubmit={props.useForm.handleSubmit(props.onSubmitActionForm)}
        className={styles.genForm}
        noValidate
      >
        <ActionForm
          control={props.useForm.control}
          errors={props.useForm.formState.errors}
          fieldName={'action'}
        />
        <Button type="submit" color={Colors.success} icon={<GiSave size={30} />} title="Save" />
      </form>
    </>
  );
};

export default CustomActions;
