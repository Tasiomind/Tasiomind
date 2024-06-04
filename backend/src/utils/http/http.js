import https from "node:https";
import http from "node:http";
import fs from "fs";
import os from "os";
import path from "path";
import { exec } from "child_process";
import config from "config/app.config";

// Set hostname and port
const hostname = os.hostname();
const port = config.port || 4000; // Default to 3000 if port not specified
const isHttps = config.https;

// Function to create HTTP or HTTPS server
const generateSSLKeys = (callback) => {
  exec("bash ./generate-ssl.bash", (err, stdout, stderr) => {
    if (err) {
      console.error("Error generating SSL certificates:", err);
      return;
    }
    console.log("SSL certificates generated:", stdout);
    callback();
  });
};

const readSSLKeys = () => {
  const ssl_keys = config.ssl_keys[0];
  const ssl_cert =
    ssl_keys.cert || path.join(__dirname, "../config/ssl/server.crt");
  const ssl_key =
    ssl_keys.key || path.join(__dirname, "../config/ssl/server.key");
  return {
    key: fs.readFileSync(ssl_key, "utf8"),
    cert: fs.readFileSync(ssl_cert, "utf8"),
  };
};

export const createServer = async (app) => {
  let httpServer;

  if (isHttps) {
    if (!config.ssl_keys || !config.ssl_keys.length) {
      await new Promise((resolve) => generateSSLKeys(resolve));
    }
    const options = readSSLKeys();
    httpServer = https.createServer(options, app);
  } else {
    httpServer = http.createServer(app);
  }

  await new Promise((resolve) => {
    httpServer.listen(port, () => {
      const protocol = isHttps ? "https" : "http";
      console.log(
        `🛰️ Monitor Server running at ${protocol}://${hostname}:${port}`
      );
      resolve();
    });
  });

  return httpServer;
};
