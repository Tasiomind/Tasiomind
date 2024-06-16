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

const defaultRoles = [
  { name: 'root', description: 'Root role with full access' },
  { name: 'admin', description: 'Administrator role' },
  { name: 'developer', description: 'Developer role' },
];

export default (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.belongsToMany(models.User, {
        as: ROLE_MEMBERS_ALIAS,
        through: USER_ROLES_JOIN_TABLE,
      });
      Role.belongsToMany(models.Permission, {
        as: PERMISSIONS_ALIAS,
        through: ROLE_PERMISSIONS_JOIN_TABLE,
      });
    }
    static async seedDefaultRoles() {
      try {
        for (const roleData of defaultRoles) {
          const existingRole = await Role.findOne({ where: { name: roleData.name } });
          if (!existingRole) {
            await Role.create(roleData);
            console.log(`Created role: ${roleData.name}`);
          } else {
            console.log(`Role "${roleData.name}" already exists, skipping creation.`);
          }
        }
      } catch (error) {
        console.error('Error seeding default roles:', error);
      }
    }
  }

  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        validate: {
          isUUID: 4,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: ROLE_NAME_UNIQUE_ERROR,
        },
        validate: {
          is: {
            args: /^[a-zA-Z0-9_:]+$/i,
            msg: ROLE_NAME_INVALID_FORMAT_ERROR,
          },
          len: {
            args: [1, 280],
            msg: ROLE_NAME_LEN_ERROR,
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [0, 280],
            msg: ROLE_DESCRIPTION_LEN_ERROR,
          },
          notEmpty: {
            msg: ROLE_DESCRIPTION_EMPTY_ERROR,
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Role',
      scopes: {
        permissions: {
          attributes: ['id', 'name'],
          include: [
            {
              association: PERMISSIONS_ALIAS,
              attributes: ['id', 'scope'],
              through: {
                attributes: [],
              },
            },
          ],
        },
      },
    },
  );

  Role.seedDefaultRoles();

  return Role;
};
