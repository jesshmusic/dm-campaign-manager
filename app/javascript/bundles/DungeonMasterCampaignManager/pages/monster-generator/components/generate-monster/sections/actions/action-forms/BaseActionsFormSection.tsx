import React from 'react';
import {
  ActionVariations,
  MonsterActionField,
  MonsterGeneratorFormFields,
} from '../../../../../../../utilities/types';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import ActionsForm from './ActionsForm';
import BasicActionsForm from './BasicActionsForm';

const styles = require('../../../../generator.module.scss');

const BaseActionsFormSection = (props: {
  actionVariation: ActionVariations;
  fieldName: keyof MonsterGeneratorFormFields;
  singularTitle: string;
  useForm: UseFormReturn<any, object>;
}) => {
  const {
    actionVariation,
    fieldName,
    singularTitle,
    useForm: { control, setValue, register, unregister, trigger },
  } = props;

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const isInitialRender = React.useRef(true);

  React.useEffect(() => {
    if (!fields.length && !isInitialRender.current) {
      trigger(fieldName);
    }

    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [fields, register, setValue, unregister, trigger]);

  const handleRemove = (index: number) => {
    remove(index);
  };

  const actionNumber = (): string => {
    return fields.length > 0 ? ` ${fields.length}` : '';
  };

  const addAction = (action: Partial<MonsterActionField>) => {
    append({
      name: `New Action${actionNumber()}`,
      ...action,
    });
  };

  switch (actionVariation) {
    case ActionVariations.action:
      return (
        <div className={styles.actionsSection}>
          <ActionsForm
            appendAction={addAction}
            fieldName={fieldName}
            fields={fields}
            handleRemove={handleRemove}
            singularTitle={singularTitle}
            useForm={props.useForm}
          />
        </div>
      );
    default:
      return (
        <div className={styles.actionsSection}>
          <BasicActionsForm
            appendAction={addAction}
            fieldName={fieldName}
            fields={fields}
            handleRemove={handleRemove}
            singularTitle={singularTitle}
            useForm={props.useForm}
          />
        </div>
      );
  }
};

export default BaseActionsFormSection;
