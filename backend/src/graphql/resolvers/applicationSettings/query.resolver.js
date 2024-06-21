export default {
  Query: {
    applicationSettings: async (_parent, _args, { dataSources }) => {
      return await dataSources.applicationSettings.findAll();
    },
    getApplicationSettingsByUserId(_parent, { userId }, { dataSources }) {
      return dataSources.applicationSettings.findByUserId(userId);
    },
  },
};
