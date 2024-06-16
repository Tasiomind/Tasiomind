import { Model } from 'sequelize';
import {
  ROLE_DESCRIPTION_EMPTY_ERROR,
  ROLE_DESCRIPTION_LEN_ERROR,
  ROLE_NAME_LEN_ERROR,
  ROLE_NAME_UNIQUE_ERROR,
  ROLE_NAME_INVALID_FORMAT_ERROR,
} from '~helpers/constants/responseCodes';
import {
  PERMISSIONS_ALIAS,
  ROLE_MEMBERS_ALIAS,
  ROLE_PERMISSIONS_JOIN_TABLE,
  USER_ROLES_JOIN_TABLE,
} from '~helpers/constants/models';

export default (sequelize, DataTypes) => {
  class UserRole extends Model {}

  UserRole.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'UserRole',
      scopes: {},
    },
  );

  return UserRole;
};
