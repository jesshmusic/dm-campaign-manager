import React from 'react';
import { UserProps } from '../../utilities/types';
import { useForm } from 'react-hook-form';

const SignInModal = (props: {
  user?: UserProps;
  userLogin: (username: string, password: string) => void;
}) => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    props.userLogin(data.email, data.password);
  };

  return (
    <div
      className="modal fade"
      id="userSigninModal"
      tabIndex={-1}
      aria-labelledby="userSigninModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              className="modal-title mr-eaves text-primary fs-3"
              id="userSigninModalLabel"
            >
              Sign In
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                />
                <div id="emailHelp" className="form-text">
                  We'll never share your email with anyone else.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className="form-control"
                  id="password"
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember_me"
                />
                <label className="form-check-label" htmlFor="remember_me">
                  Remember Me
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
