import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import { Formik, Form, FormikProps } from 'formik';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';

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
  })
);

interface ISignUpForm {
  email: string;
  password: string;
}

interface IFormStatus {
  message: string;
  type: string;
}

interface IFormStatusProps {
  [key: string]: IFormStatus;
}

const formStatusProps: IFormStatusProps = {
  error: {
    message: 'Something went wrong. Please try again.',
    type: 'error',
  },
};

export const SignIn: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [displayFormStatus, setDisplayFormStatus] = useState(false);
  const [formStatus, setFormStatus] = useState<IFormStatus>({
    message: '',
    type: '',
  });

  const onLogin = async (data: ISignUpForm, setSubmitting: Function) => {
    try {
      console.log(data);
      if (data) {
        const response = await axios.post('/api/auth/login', data);

        if (response.data?.message === 'login') {
          return history.push('/');
        } else {
          setFormStatus(formStatusProps.error);
        }
      }
    } catch (error) {
      setFormStatus(formStatusProps.error);
    } finally {
      setDisplayFormStatus(true);
      setSubmitting(false);
    }
  };

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={(values: ISignUpForm, actions) => {
          console.log(values);
          onLogin(values, actions.setSubmitting);
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email().required('Please enter user email'),
          password: Yup.string()
            .min(5)
            .required('Please enter a valid password. Min. 5 characters'),
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
              <h1 className={classes.title}>Sign in</h1>
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
                    name="email"
                    id="email"
                    label="Email"
                    value={values.email}
                    type="text"
                    helperText={
                      errors.email && touched.email
                        ? errors.email
                        : 'Enter your email.'
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
                  className={classes.submitButton}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={isSubmitting}
                  >
                    Sign in
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
