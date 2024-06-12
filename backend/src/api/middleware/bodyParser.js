export default (express, app) => {
  app.use(
    express.json({
      limit: '50mb',
    }),
  );

  app.use(
    express.urlencoded({
      extended: true,
    }),
  );
};
