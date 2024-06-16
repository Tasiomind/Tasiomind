import gql from 'graphql-tag';

export const CreateApplication = gql`
  mutation CreateApplication($name: NonEmptyString!, $description: String, $url: URL, $logo: URL) {
    createApplication(input: { name: $name, description: $description, url: $url, logo: $logo }) {
      code
      success
      message
      application {
        id
        name
        description
        url
        logo
        createdAt
        updatedAt
      }
    }
  }
`;

export const UpdateApplication = gql`
  mutation UpdateApplication(
    $id: UUID!
    $name: NonEmptyString!
    $description: String
    $url: URL
    $logo: URL
  ) {
    updateApplication(
      input: { id: $id, name: $name, description: $description, url: $url, logo: $logo }
    ) {
      code
      success
      message
      application {
        id
        name
        description
        url
        logo
        createdAt
        updatedAt
      }
    }
  }
`;

export const DeleteApplication = gql`
  mutation DeleteApplication($id: UUID!) {
    deleteApplication(input: { id: $id }) {
      code
      success
      message
    }
  }
`;
