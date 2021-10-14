import React from 'react';
import { UserProps } from '../../utilities/types';
import { useForm } from 'react-hook-form';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import FormField from '../forms/FormField';

const styles = require('./sign-in-modal.module.scss');

const SignInModal = (props: {
  user?: UserProps;
  userLogin: (username: string, password: string) => void;
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
      remember_me: false
    }
  });
  const onSubmit = (data) => {
    props.userLogin(data.email, data.password);
  };

  return (
    <div
      className='modal fade'
      id='userSigninModal'
      tabIndex={-1}
      aria-labelledby='userSigninModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5
              className='modal-title mr-eaves text-primary fs-3'
              id='userSigninModalLabel'
            >
              Sign In
            </h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            />
          </div>
          <div className='modal-body'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormField label='Email Address'
                         name='email'
                         type='email'
                         helpText="We'll never share your email with anyone else."
                         register={register} />
              <FormField label='Password'
                         name='password'
                         type='password'
                         register={register} />
              <FormField label='Remember Me'
                         name='remember_me'
                         type='checkbox'
                         register={register} />
              <Button
                title='Submit'
                type='submit'
                dataBsDismiss='modal'
                color={Colors.success} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
