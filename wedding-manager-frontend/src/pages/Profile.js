import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthService from '../services/auth.service';

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      // In a real app, you'd fetch detailed user profile from the backend
      // For now, we'll use the stored user data
      setUser(currentUser);
      setLoading(false);
    }
  }, []);

  const initialValues = {
    username: user.username || '',
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phoneNumber: user.phoneNumber || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .max(50, 'First name must not exceed 50 characters'),
    lastName: Yup.string()
      .max(50, 'Last name must not exceed 50 characters'),
    phoneNumber: Yup.string()
      .matches(/^[0-9+\-() ]+$/, 'Phone number can only contain numbers and +, -, (, ) characters'),
    currentPassword: Yup.string()
      .when('newPassword', {
        is: val => val && val.length > 0,
        then: schema => schema.required('Current password is required to set a new password')
      }),
    newPassword: Yup.string()
      .min(6, 'New password must be at least 6 characters')
      .max(40, 'New password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
  });

  const handleSubmit = (formValue, { setSubmitting, resetForm }) => {
    const { firstName, lastName, phoneNumber, currentPassword, newPassword } = formValue;

    setMessage('');
    setUpdateSuccess(false);

    AuthService.updateProfile(firstName, lastName, phoneNumber, currentPassword, newPassword)
      .then(response => {
        setMessage('Profile updated successfully!');
        setUpdateSuccess(true);
        setSubmitting(false);
        setUser(response); // Update local user state with the response

        // Reset password fields
        resetForm({
          values: {
            ...formValue,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
        });
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setUpdateSuccess(false);
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">My Profile</h2>
              
              {message && (
                <div className={`alert ${updateSuccess ? 'alert-success' : 'alert-danger'} mb-4`} role="alert">
                  {message}
                </div>
              )}

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <Field
                          name="firstName"
                          type="text"
                          className={`form-control ${errors.firstName && touched.firstName ? 'is-invalid' : ''}`}
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <Field
                          name="lastName"
                          type="text"
                          className={`form-control ${errors.lastName && touched.lastName ? 'is-invalid' : ''}`}
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <Field
                        name="email"
                        type="email"
                        className="form-control"
                        disabled
                      />
                      <small className="form-text text-muted">Email cannot be changed</small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username</label>
                      <Field
                        name="username"
                        type="text"
                        className="form-control"
                        disabled
                      />
                      <small className="form-text text-muted">Username cannot be changed</small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                      <Field
                        name="phoneNumber"
                        type="text"
                        className={`form-control ${errors.phoneNumber && touched.phoneNumber ? 'is-invalid' : ''}`}
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    <hr className="my-4" />
                    <h5 className="mb-3">Change Password</h5>

                    <div className="mb-3">
                      <label htmlFor="currentPassword" className="form-label">Current Password</label>
                      <Field
                        name="currentPassword"
                        type="password"
                        className={`form-control ${errors.currentPassword && touched.currentPassword ? 'is-invalid' : ''}`}
                      />
                      <ErrorMessage
                        name="currentPassword"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">New Password</label>
                      <Field
                        name="newPassword"
                        type="password"
                        className={`form-control ${errors.newPassword && touched.newPassword ? 'is-invalid' : ''}`}
                      />
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
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

                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving Changes...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 