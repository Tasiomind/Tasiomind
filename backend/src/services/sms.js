import twilio from 'twilio';
import log from '~utils/logger';
import Sentry from './sentry';
import config from 'config/app.config';

const accountSid = config.twilio.accountSid;
const authToken = config.twilio.authToken;

const sendSMS = async (message, to) => {
  if (config.appStatus === 'test') {
    return;
  }

  log.info({ to, message });
  try {
    const client = twilio(accountSid, authToken);
    const response = await client.messages.create({
      body: message,
      from: config.twilio.PhoneNumber,
      to,
    });

    log.info(response.sid);
  } catch (err) {
    Sentry.captureException(err);
    log.error({ err });
  }
};

export default sendSMS;
