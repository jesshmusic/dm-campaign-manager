import React from 'react';
import { GiAbacus } from 'react-icons/gi';
import { Colors } from '../../../../../../utilities/enums';
import Button from '../../../../../../components/Button/Button';
import SavingThrowForm from './SavingThrowForm';
import { FieldArrayFormProps } from '../../../../../../utilities/types';
import { useFieldArray } from 'react-hook-form';

const SavingThrowsForm = (props: FieldArrayFormProps) => {
  const {
    fieldName,
    useForm: {
      control,
      formState: { errors },
      register,
      setValue,
      trigger,
      unregister
    }
  } = props;

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName
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

  const addSavingThrow = () => {
    append({
      nameOption: null,
      name: '',
      value: 0
    });
  };

  return (
    <>
      {fields.map((savingThrow, savingThrowIndex) => (
        <SavingThrowForm
          key={savingThrow.id}
          savingThrowIndex={savingThrowIndex}
          fieldName={fieldName}
          control={control}
          errors={errors}
          remove={handleRemove}
        />
      ))}
      <Button
        type='button'
        onClick={addSavingThrow}
        color={Colors.primary}
        icon={<GiAbacus size={30} />}
        title={`Add Saving Throw`}
      />
    </>
  );
};

export default SavingThrowsForm;
