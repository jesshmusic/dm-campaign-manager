import React from 'react';
import { GiAbacus } from 'react-icons/gi';
import { Colors } from '../../../../../../utilities/enums';
import Button from '../../../../../../components/Button/Button';
import SenseForm from './SenseForm';
import { FieldArrayFormProps } from '../../../../../../utilities/types';
import { useFieldArray } from 'react-hook-form';
import { senses } from '../../../../../../utilities/character-utilities';

const SensesForm = (props: FieldArrayFormProps) => {
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

  const addSense = () => {
    append({
      nameOption: senses[0],
      name: senses[0].label,
      value: '',
    });
  };

  return (
    <>
      {fields.map((sense, senseIndex) => (
        <SenseForm
          key={sense.id}
          senseIndex={senseIndex}
          fieldName={fieldName}
          control={control}
          errors={errors}
          remove={handleRemove}
        />
      ))}
      <Button
        type="button"
        onClick={addSense}
        color={Colors.primary}
        icon={<GiAbacus size={30} />}
        title={`Add Sense`}
      />
    </>
  );
};

export default SensesForm;
