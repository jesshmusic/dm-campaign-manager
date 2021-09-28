/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import { FieldProps } from '../../utilities/types';
import { useForm } from 'react-hook-form';

const FormField = (props: FieldProps) => {
  const {
    className,
    columnWidth = 1,
    defaultValue,
    id,
    infoText,
    label,
    name,
    readOnly,
    register,
    required,
    type,
    value
  } = props;
  // if (type === 'checkbox' || type === 'radio') {
  //   return (
  //     <Field name={name} type={type} value={value} validate={(value) => !required || value ? undefined : 'Required'}>
  //       {({ input, meta }) => (
  //         <div className={classNames(className, 'form-check')}>
  //           <input
  //             className='form-check-input'
  //             {...input}
  //             type={type}
  //             name={name}
  //             value={value}
  //             required={required}
  //             id={id} />
  //           <label className='form-check-label' htmlFor={name}>
  //             {label}
  //           </label>
  //         </div>
  //       )}
  //     </Field>
  //   );
  // }
  return (
    <div className={`py-2 g-col-${props.columnWidth} ${className}`}>
      <label className='form-label' htmlFor={name}>
        {label}
      </label>
      <input className='form-control'
             {...register(name, { required })}
      />
      {/*{infoText ? (*/}
      {/*  <div className='text-muted form-text'>*/}
      {/*    {infoText}*/}
      {/*  </div>*/}
      {/*) : null}*/}
      {/*<div className='invalid-feedback'>{meta.error}</div>*/}
    </div>
  );
};

export default FormField;