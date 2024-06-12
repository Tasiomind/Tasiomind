module.exports = {
  client: {
    service: {
      name: 'my-app',
      url: 'https://localhost:4000/graphql',
    },
    headers: {
      authorization: 'Bearer lkjfalkfjadkfjeopknavadf',
    },
    // optionally turn off SSL validation check
    skipSSLValidation: true,
    includes: ['src/**/*.vue', 'src/**/*.js'],
  },
};
