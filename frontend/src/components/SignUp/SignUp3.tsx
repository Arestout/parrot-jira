import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  Theme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '450px',
      display: 'block',
      margin: '40px auto',
    },
    textField: {
      '& > *': {
        width: '100%',
      },
    },
    submitButton: {
      marginTop: '24px',
    },
    title: { textAlign: 'center' },
    successMessage: { color: 'green' },
    errorMessage: { color: 'red' },
    formControl: {
      minWidth: '100%',
    },
  })
);

interface ISignUpForm {
  fullName: string;
  username: string;
  role: string;
  password: string;
  confirmPassword: string;
  email: string;
  slack: string;
  mobile: string;
}

interface IFormStatus {
  message: string;
  type: string;
}

interface IFormStatusProps {
  [key: string]: IFormStatus;
}

const formStatusProps: IFormStatusProps = {
  success: {
    message: 'Signed up successfully.',
    type: 'success',
  },
  duplicate: {
    message: 'Email-id already exist. Please use different email-id.',
    type: 'error',
  },
  error: {
    message: 'Something went wrong. Please try again.',
    type: 'error',
  },
};

export const SignUp: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [displayFormStatus, setDisplayFormStatus] = useState(false);
  const [formStatus, setFormStatus] = useState<IFormStatus>({
    message: '',
    type: '',
  });

  const createNewUser = async (data: ISignUpForm, setSubmitting: Function) => {
    console.log({ data });
    try {
      if (data) {
        const response = await axios.post('/api/auth/signup', data);
        if (response.data?.message === 'Registration successful') {
          return history.push('/sign-in');
        } else {
          setFormStatus(formStatusProps.error);
          setSubmitting(false);
        }
      }
    } catch (error) {
      const response = error.response;
      if (response.status === 409) {
        setFormStatus(formStatusProps.duplicate);
      } else {
        setFormStatus(formStatusProps.error);
      }
    } finally {
      setDisplayFormStatus(true);
      setSubmitting(false);
    }
  };

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          fullName: '',
          username: '',
          role: '',
          password: '',
          confirmPassword: '',
          email: '',
          slack: '',
          mobile: '',
        }}
        onSubmit={(values: ISignUpForm, actions) => {
          console.log({ values });
          createNewUser(values, actions.setSubmitting);
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email().required('Please enter a valid email-id'),
          fullName: Yup.string().required('Please enter full name'),
          userName: Yup.string().required('Please enter user name'),
          role: Yup.string().required('Please choose your role'),
          slack: Yup.string().required('Please enter a slack-id'),
          mobile: Yup.string().required('Please enter a mobile-id'),
          password: Yup.string()
            .min(5)
            .required('Please enter a valid password. Min. 5 characters'),
          confirmPassword: Yup.string()
            .required('Required')
            .test('password-match', 'Password musth match', function (value) {
              return this.parent.password === value;
            }),
        })}
      >
        {(props: FormikProps<ISignUpForm>) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            isSubmitting,
          } = props;
          return (
            <Form>
              <h1 className={classes.title}>Sign up</h1>
              <Grid container justify="space-around" direction="row">
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.textField}
                >
                  <TextField
                    name="fullName"
                    id="fullName"
                    label="Full Name"
                    value={values.fullName}
                    type="text"
                    helperText={
                      errors.fullName && touched.fullName
                        ? errors.fullName
                        : 'Enter your full name.'
                    }
                    error={errors.fullName && touched.fullName ? true : false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.textField}
                >
                  <TextField
                    name="username"
                    id="username"
                    label="Username"
                    value={values.username}
                    type="text"
                    helperText={
                      errors.username && touched.username
                        ? errors.username
                        : 'Enter your username.'
                    }
                    error={errors.username && touched.username ? true : false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.textField}
                >
                  <FormControl className={classes.formControl}>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      name="role"
                      value={values.role}
                      onChange={handleChange}
                    >
                      <MenuItem value="developer">Developer</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="accountant">Accountant</MenuItem>
                    </Select>
                    <FormHelperText>Some important helper text</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.textField}
                >
                  <TextField
                    name="password"
                    id="password"
                    label="Password"
                    value={values.password}
                    type="password"
                    helperText={
                      errors.password && touched.password
                        ? 'Please enter a valid password. Min. 5 characters'
                        : 'Min. 5 characters'
                    }
                    error={errors.password && touched.password ? true : false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.textField}
                >
                  <TextField
                    name="confirmPassword"
                    id="confirmPassword"
                    label="Confirm password"
                    value={values.confirmPassword}
                    type="password"
                    helperText={
                      errors.confirmPassword && touched.confirmPassword
                        ? errors.confirmPassword
                        : 'Re-enter password to confirm'
                    }
                    error={
                      errors.confirmPassword && touched.confirmPassword
                        ? true
                        : false
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.textField}
                >
                  <TextField
                    name="email"
                    id="email"
                    label="Email-id"
                    value={values.email}
                    type="email"
                    helperText={
                      errors.email && touched.email
                        ? errors.email
                        : 'Enter email-id'
                    }
                    error={errors.email && touched.email ? true : false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.textField}
                >
                  <TextField
                    name="slack"
                    id="slack"
                    label="Slack-id"
                    value={values.slack}
                    type="text"
                    helperText={
                      errors.slack && touched.slack
                        ? errors.slack
                        : 'Enter Slack-id'
                    }
                    error={errors.slack && touched.slack ? true : false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.textField}
                >
                  <TextField
                    name="mobile"
                    id="mobile"
                    label="Mobile"
                    value={values.mobile}
                    type="text"
                    helperText={
                      errors.mobile && touched.mobile
                        ? errors.mobile
                        : 'Enter your mobile number'
                    }
                    error={errors.mobile && touched.mobile ? true : false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.submitButton}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                  {displayFormStatus && (
                    <div className="formStatus">
                      {formStatus.type === 'error' ? (
                        <p className={classes.errorMessage}>
                          {formStatus.message}
                        </p>
                      ) : formStatus.type === 'success' ? (
                        <p className={classes.successMessage}>
                          {formStatus.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
