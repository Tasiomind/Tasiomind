import gql from 'graphql-tag';

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

export const VerifyEmail = gql`
  mutation VerifyEmail($token: NonEmptyString!) {
    verifyEmail(token: $token) {
      code
      success
      message
    }
  }
`;
