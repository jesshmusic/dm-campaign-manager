import React from 'react';
import { GiAbacus } from 'react-icons/gi';
import { FieldArrayFormProps } from '../../../../../../utilities/types';
import { useFieldArray } from 'react-hook-form';
import SpeedForm from './SpeedForm';
import Button from '../../../../../../components/Button/Button';
import { Colors } from '../../../../../../utilities/enums';

const SpeedsForm = (props: FieldArrayFormProps) => {
  const {
    fieldName,
    useForm: {
      control,
      formState: { errors },
      register,
      setValue,
      trigger,
      unregister,
    },
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

  const addSpeed = () => {
    append({
      name: '',
      value: '',
    });
  };

  return (
    <>
      {fields.map((speed, speedIndex) => (
        <SpeedForm
          key={speed.id}
          speedIndex={speedIndex}
          fieldName={fieldName}
          control={control}
          errors={errors}
          remove={handleRemove}
        />
      ))}
      <Button
        type="button"
        onClick={addSpeed}
        color={Colors.primary}
        icon={<GiAbacus size={30} />}
        title={`Add Speed`}
      />
    </>
  );
};

export default SpeedsForm;
