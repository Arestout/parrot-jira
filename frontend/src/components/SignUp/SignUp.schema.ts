import * as Yup from 'yup';

export const SignUpSchema = Yup.object().shape({
  email: Yup.string().email().required('Please enter a valid email-id'),
  fullName: Yup.string().required('Please enter full name'),
  username: Yup.string().required('Please enter user name'),
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
});
