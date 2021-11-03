import React from 'react';
import { GiAbacus } from 'react-icons/gi';
import { Colors } from '../../../../../../utilities/enums';
import Button from '../../../../../../components/Button/Button';
import { FieldArrayFormProps } from '../../../../../../utilities/types';
import { useFieldArray } from 'react-hook-form';
import SkillForm from './SkillForm';

const SkillsForm = (props: FieldArrayFormProps) => {
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

  const addSkill = () => {
    append({
      nameOption: null,
      name: '',
      value: 0
    });
  };

  return (
    <>
      {fields.map((skill, skillIndex) => (
        <SkillForm
          key={skill.id}
          skillIndex={skillIndex}
          fieldName={fieldName}
          control={control}
          errors={errors}
          remove={handleRemove}
        />
      ))}
      <Button
        type='button'
        onClick={addSkill}
        color={Colors.primary}
        icon={<GiAbacus size={30} />}
        title={`Add Skill`}
      />
    </>
  );
};

export default SkillsForm;
