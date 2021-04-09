import * as Yup from 'yup';

export const SignInSchema = Yup.object().shape({
  email: Yup.string().email().required('Please enter user email'),
  password: Yup.string()
    .min(5)
    .required('Please enter a valid password. Min. 5 characters'),
});
