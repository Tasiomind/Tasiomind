import gql from 'graphql-tag';

export const LoginWithEmail = gql`
  mutation LoginWithEmail($email: EmailAddress!, $password: NonEmptyString!) {
    loginWithEmail(input: { email: $email, password: $password }) {
      code
      success
      message
    }
  }
`;

export const RegisterWithEmail = gql`
  mutation RegisterWithEmail(
    $firstName: NonEmptyString!
    $lastName: NonEmptyString!
    $username: NonEmptyString!
    $email: EmailAddress!
    $password: NonEmptyString!
    $phoneNumber: PhoneNumber
    $locale: Locale
    $timezone: TimeZone
  ) {
    registerWithEmail(
      input: {
        firstName: $firstName
        lastName: $lastName
        username: $username
        email: $email
        password: $password
        phoneNumber: $phoneNumber
        locale: $locale
        timezone: $timezone
      }
    ) {
      code
      success
      message
    }
  }
`;

export const RequestPasswordReset = gql`
  mutation RequestPasswordReset($email: EmailAddress!) {
    requestPasswordReset(email: $email) {
      code
      success
      message
    }
  }
`;

export const ResetPassword = gql`
  mutation ResetPassword($token: NonEmptyString!, $password: NonEmptyString!) {
    resetPassword(input: { token: $token, password: $password }) {
      code
      success
      message
    }
  }
`;

export const RequestEmailVerification = gql`
  mutation RequestEmailVerification($email: EmailAddress!) {
    requestEmailVerification(email: $email) {
      code
      success
      message
    }
  }
`;

export const logout = gql`
  mutation Logout($all: Boolean) {
    logout(all: $all) {
      code
      success
      message
    }
  }
`;
