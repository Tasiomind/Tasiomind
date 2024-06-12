import gql from 'graphql-tag';

export const Me = gql`
  query Me {
    me {
      code
      success
      message
      user {
        id
        firstName
        lastName
        username
        roles {
          id
          name
          description
          createdAt
          updatedAt
        }
        socialAvatarURL
      }
    }
  }
`;
