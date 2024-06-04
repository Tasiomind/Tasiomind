import btoa from 'btoa';
import config from 'config/app.config';

export const getImageUrl = (file, resize) => {
  const imageRequest = {
    ...file,
    edits: {
      resize,
    },
  };

  return `${config.hostname + config.port}/${btoa(JSON.stringify(imageRequest))}`;
};

const links = {
  verifyEmail: token => `${config.clients.host}/verify-email?token=${token}`,
  resetPassword: token => `${config.clients.host}/reset-password?token=${token}`,
  deleteAccount: token => `${config.clients.host}/delete-account?token=${token}`,
  getImageUrl,
};

export default links;
