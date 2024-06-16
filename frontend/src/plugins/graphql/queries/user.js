import gql from 'graphql-tag';

export const Me = gql`
  query Me {
    me {
      code
      success
      message
      user {
        firstName
        lastName
        username
        roles {
          name
        }
        socialAvatarURL
        phoneNumberVerified
        emailVerified
        timezone
        locale
        isLocked
        isOwner
        avatar {
          url
          thumbnail
        }
        phoneNumber
        email
        fullName
      }
    }
  }
`;

// get all users
export const Users = gql`
  query Users {
    users {
      code
      success
      message
      users {
        id
        firstName
        lastName
        username
        email
        phoneNumber
        locale
        timezone
        status
        roles {
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;
