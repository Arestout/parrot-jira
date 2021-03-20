import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  Theme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Avatar,
  CssBaseline,
  Link,
  Typography,
  Container,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import axios from 'axios';
import { SignUpSchema } from './SignUp.schema';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  successMessage: { color: 'green' },
  errorMessage: { color: 'red' },
  formControl: {
    minWidth: '100%',
  },
}));

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
    try {
      if (data) {
        console.log(data);
        const response = await axios.post('/api/auth/signup', data);

        if (response.data?.message === 'Registration successful') {
          return history.push('/sign-in');
        } else {
          setFormStatus(formStatusProps.error);
        }
      }
    } catch (error) {
      if (error.response.status === 409) {
        setFormStatus(formStatusProps.duplicate);
      } else {
        setFormStatus(formStatusProps.error);
      }
      setDisplayFormStatus(true);
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registration
        </Typography>
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
            createNewUser(values, actions.setSubmitting);
          }}
          validationSchema={SignUpSchema}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleBlur,
              handleChange,
              isSubmitting,
            } = props;
            return (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="fullName"
                      variant="outlined"
                      required
                      fullWidth
                      autoFocus
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
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="username"
                      variant="outlined"
                      required
                      fullWidth
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
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="current-password"
                      variant="outlined"
                      required
                      fullWidth
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
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
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
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
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
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
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
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
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
                  <Grid item xs={12}>
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
                      <FormHelperText>
                        Some important helper text
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={isSubmitting}
                >
                  Register
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
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link to="/sign-in" component={RouterLink} variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Container>
  );
};
