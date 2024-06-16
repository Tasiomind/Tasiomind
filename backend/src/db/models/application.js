import { uuidv4 } from '~utils/uuid';
import { Model } from 'sequelize';
import Sentry from '~services/sentry';

import {
  APPLICATION_DESCRIPTION_EMPTY_ERROR,
  APPLICATION_DESCRIPTION_LEN_ERROR,
  APPLICATION_NAME_EMPTY_ERROR,
  APPLICATION_NAME_LEN_ERROR,
} from '~helpers/constants/responseCodes';

export default (sequelize, DataTypes) => {
  class Application extends Model {
    static associate(models) {
      Application.hasMany(models.User, {
        foreignKey: 'applicationID',
        as: 'users',
      });
    }
  }
  Application.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuidv4,
        validate: {
          isUUID: {
            args: 4,
            msg: 'ID must be a valid UUID',
          },
        },
      },
      clientID: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: uuidv4,
        validate: {
          notNull: {
            msg: 'Client ID cannot be null',
          },
          notEmpty: {
            msg: 'Client ID cannot be empty',
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 100],
            msg: APPLICATION_NAME_LEN_ERROR,
          },
          notNull: {
            msg: APPLICATION_NAME_EMPTY_ERROR,
          },
          notEmpty: {
            msg: APPLICATION_NAME_EMPTY_ERROR,
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [0, 140],
            msg: APPLICATION_DESCRIPTION_LEN_ERROR,
          },
          notEmpty: {
            msg: APPLICATION_DESCRIPTION_EMPTY_ERROR,
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Application',
      hooks: {
        beforeValidate: (application, options) => {
          try {
            Sentry.addBreadcrumb({
              category: 'application',
              message: 'Validating application data',
              level: Sentry.Severity.Info,
            });
          } catch (err) {
            console.error('Error in beforeValidate hook:', err);
            Sentry.captureException(err);
          }
        },
      },
    },
  );

  Application.seedInitialRow = async () => {
    await Application.create({
      id: '96341873-520f-480c-be51-37a1979c8d83',
      clientID: 'f078d36a-b15a-4387-a0e3-726b7e48b777',
      name: 'frontend',
      description: 'Frontend application',
    });
  };

  return Application;
};
