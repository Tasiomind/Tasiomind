import sms from '~services/sms';
import { sendEmail } from '~services/email';

const mailer = {
  sendSMS: sms,
  sendEmail: sendEmail,
};

export default mailer;
