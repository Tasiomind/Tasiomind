import https from 'node:https';
import http from 'node:http';
import os from 'node:os';
import { generateCertificate } from '~utils/certificate';
import config from 'config/app.config';

const hostname = os.hostname();
const port = config.server.port || 4000;
const isHttps = config.server.https || false;

export const createServer = async app => {
  let server;

  try {
    if (isHttps) {
      const certificate = await generateCertificate();
      const options = {
        key: certificate.key,
        cert: certificate.cert,
      };
      server = https.createServer(options, app);
    } else {
      server = http.createServer(app);
    }

    await new Promise(resolve => {
      server.listen(port, () => {
        console.log(
          `🛰️ Monitor Server running at ${isHttps ? 'https' : 'http'}://${hostname}:${port}`,
        );
        resolve();
      });
    });

    return server;
  } catch (error) {
    console.error('Error creating server:', error);
    throw error;
  }
};
