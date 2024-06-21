import { uuidv4 } from '~utils/uuid';
import { Sequelize, Model } from 'sequelize';
import config from 'config/app.config';

export default (sequelize, DataTypes) => {
  class ApplicationSettings extends Model {
    static async associate(models) {
      ApplicationSettings.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      ApplicationSettings.seedDefaultApplicationSettings(models);
    }

    static async seedDefaultApplicationSettings(models) {
      const User = models.User;
      const user = await User.findOne();
      if (!user) return;

      const existingApplicationSettings = await ApplicationSettings.findOne({
        where: { userId: user.id },
      });

      if (existingApplicationSettings) return;
      await ApplicationSettings.create({
        userId: user.id,
      });
    }
  }
  ApplicationSettings.init(
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

      theme: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'light',
        validate: {
          isIn: {
            args: [['light', 'dark']],
            msg: 'Theme should be either "light" or "dark"',
          },
        },
      },
      navigationMenu: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'vertical',
        validate: {
          isIn: {
            args: [['vertical', 'horizontal']],
            msg: 'Navigation menu should be either "vertical" or "horizontal"',
          },
        },
      },
      isBoxLayout: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isVerticalMenuMini: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      defaultLocale: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'de',
        validate: {
          isIn: {
            args: [['en', 'de']], // Add more locales as needed
            msg: 'Locale should be either "en" or "de"',
          },
        },
      },
      isRtl: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isSemiDark: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      skins: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'modern',
        validate: {
          isIn: {
            args: [['classic', 'modern', 'decent', 'bordered']],
            msg: 'Skin should be one of: classic, modern, decent, bordered',
          },
        },
      },
      isNavbarFixed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'ApplicationSettings',
      timestamps: false,
    },
  );

  return ApplicationSettings;
};
