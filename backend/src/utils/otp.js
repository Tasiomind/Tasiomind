import { nanoid, customAlphabet } from '~utils/uuid';

import { EMAIL_OTP_LENGTH, SMS_OTP_LENGTH } from '~helpers/constants/auth';

const getNumberCode = (size = SMS_OTP_LENGTH) => {
  return customAlphabet('1234567890', size);
};

const getEmailOTP = (size = EMAIL_OTP_LENGTH) => nanoid(size);

export default {
  getNumberCode,
  getEmailOTP,
};
