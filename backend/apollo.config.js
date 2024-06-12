module.exports = {
  service: {
    endpoint: {
      url: 'https://localhost:4000/graphql', // defaults to http://localhost:4000
      headers: {
        // optional
        authorization: 'Bearer lkjfalkfjadkfjeopknavadf',
      },
      skipSSLValidation: true, // optional, disables SSL validation check
    },
  },
};
