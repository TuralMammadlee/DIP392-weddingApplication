import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthService from '../services/auth.service';

const Register = () => {
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must not exceed 20 characters'),
    email: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    acceptTerms: Yup.bool()
      .oneOf([true], 'You must accept the terms and conditions')
  });

  const handleRegister = (formValue, { setSubmitting }) => {
    const { username, email, password } = formValue;

    setMessage('');
    setSuccessful(false);

    AuthService.register(username, email, password)
      .then(response => {
        setMessage(response.data.message || 'Registration successful! Please check your email to verify your account.');
        setSuccessful(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4">Create Your Account</h2>
              
              {message && (
                <div className={`alert ${successful ? 'alert-success' : 'alert-danger'} mb-4`} role="alert">
                  {message}
                </div>
              )}

              {!successful && (
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleRegister}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <Field
                          name="username"
                          type="text"
                          className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <Field
                          name="email"
                          type="email"
                          className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <Field
                          name="password"
                          type="password"
                          className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <Field
                          name="confirmPassword"
                          type="password"
                          className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="mb-4">
                        <div className="form-check">
                          <Field
                            name="acceptTerms"
                            type="checkbox"
                            className={`form-check-input ${errors.acceptTerms && touched.acceptTerms ? 'is-invalid' : ''}`}
                            id="acceptTerms"
                          />
                          <label className="form-check-label" htmlFor="acceptTerms">
                            I accept the <Link to="/terms">terms and conditions</Link>
                          </label>
                          <ErrorMessage
                            name="acceptTerms"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>

                      <div className="d-grid mb-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Creating Account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </button>
                      </div>

                      <div className="text-center">
                        <p>
                          Already have an account? <Link to="/login">Log in</Link>
                        </p>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 