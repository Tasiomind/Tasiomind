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

export const VerifyEmail = gql`
  mutation VerifyEmail($token: NonEmptyString!) {
    verifyEmail(token: $token) {
      code
      success
      message
    }
  }
`;

export const deleteAccount = gql`
  mutation DeleteAccount($token: NonEmptyString) {
    deleteAccount(token: $token) {
      code
      success
      message
    }
  }
`;

export const deleteUser = gql`
  mutation DeleteUser($id: UUID!) {
    deleteUser(id: $id) {
      code
      success
      message
    }
  }
`;

// createRole
export const createRole = gql`
  mutation CreateRole($name: NonEmptyString!, $description: String) {
    createRole(input: { name: $name, description: $description }) {
      code
      success
      message
      role {
        id
        name
        description
        createdAt
        updatedAt
      }
    }
  }
`;

// updateRole
export const updateRole = gql`
  mutation UpdateRole($id: UUID!, $name: NonEmptyString!, $description: String) {
    updateRole(input: { id: $id, name: $name, description: $description }) {
      code
      success
      message
      role {
        id
        name
        description
        createdAt
        updatedAt
      }
    }
  }
`;

// deleteRole
export const deleteRole = gql`
  mutation DeleteRole($id: UUID!) {
    deleteRole(input: { id: $id }) {
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
