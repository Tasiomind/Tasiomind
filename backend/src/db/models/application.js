import { uuidv4 } from '~utils/uuid';
import { Model } from 'sequelize';
import Sentry from '~services/sentry';
import {
  APPLICATION_DESCRIPTION_EMPTY_ERROR,
  APPLICATION_DESCRIPTION_LEN_ERROR,
  APPLICATION_NAME_EMPTY_ERROR,
  APPLICATION_NAME_LEN_ERROR,
} from '~helpers/constants/responseCodes';
import config from 'config/app.config';

export default (sequelize, DataTypes) => {
  class Application extends Model {
    static associate(models) {
      Application.seedDefaultApplications();
    }
    static async seedDefaultApplications() {
      for (const applicationData of config.defaultApplications) {
        const existingApplication = await Application.findOne({
          where: { clientID: applicationData.clientID },
        });
        if (!existingApplication) {
          await Application.create(applicationData);
        }
      }
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

  return Application;
};
