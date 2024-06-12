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
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {}
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
              level: 'info',
            });
          } catch (err) {
            console.error('Error in beforeValidate hook:', err);
            Sentry.captureException(err);
          }
        },
      },
    },
  );

  return Application;
};
