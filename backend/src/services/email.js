import Email from 'email-templates';
import nodemailer from 'nodemailer';
import { resolve } from 'path';
import log from '~utils/logger';
import Sentry from './sentry';
import config from 'config/app.config';

const { appStatus, mail } = config;
const { mailFrom, smtpOptions } = mail;

// Create a transport object using the default SMTP transport
const emailTransporter = nodemailer.createTransport(smtpOptions);

const email = new Email({
  message: {
    from: mailFrom,
  },
  transport: emailTransporter,
  subjectPrefix: appStatus === 'dev' && `[${appStatus.toUpperCase()}] `,
  i18n: {
    locales: ['en'],
    directory: resolve('locales/emails'),
  },
  send: appStatus !== 'test',
});

export const sendEmail = async ({ template, message, locals }) => {
  if (appStatus === 'test') {
    return;
  }
  try {
    const info = await email.send({ template, message, locals });

    log.info(`Message sent: ${info.messageId}`);
  } catch (err) {
    log.error({ err });
    Sentry.captureException(err);
  }
};

export const sendEmailWithHtml = async (to, subject, html, attachments = []) => {
  const mailOptions = {
    from: mailFrom,
    to: to,
    subject: subject,
    html: html,
    attachments: attachments,
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};
