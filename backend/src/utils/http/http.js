import https from 'node:https';
import http from 'node:http';
import os from 'node:os';
import { readSSLKeys } from '~utils/ssl';
import config from 'config/app.config';

const hostname = os.hostname();
const port = config.server.port || 4000;
const isHttps = config.server.https || false;

export const createServer = async app => {
  let server;

  try {
    if (isHttps) {
      const options = await readSSLKeys();
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
