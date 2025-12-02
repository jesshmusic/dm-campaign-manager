import React from 'react';

import { FormWrapper, FormLabel, FormInput } from './Forms.styles';

const ReadOnlyField = (props: {
  className?: string;
  label: string;
  name: string;
  value: string | number;
}) => {
  const { className, label, name, value } = props;
  return (
    <FormWrapper className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <FormInput autoComplete={''} type={'text'} readOnly value={value} />
    </FormWrapper>
  );
};

export default ReadOnlyField;
