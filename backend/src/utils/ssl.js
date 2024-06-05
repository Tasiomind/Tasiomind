import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { uuidv4 } from '~utils/uuid';
import config from 'config/app.config';
import { promisify } from 'util';

// Utility function to read SSL key files
const readFileAsync = promisify(fs.readFile);
const execAsync = promisify(exec);
const writeFileAsync = promisify(fs.writeFile);

export const readSSLKeys = async () => {
  const sslKeysConfig = config.server.ssl_keys;
  const certPath = sslKeysConfig.cert;
  const keyPath = sslKeysConfig.key;

  let cert = null;
  let key = null;

  try {
    [cert, key] = await Promise.all([
      readFileAsync(certPath, 'utf8'),
      readFileAsync(keyPath, 'utf8'),
    ]);
  } catch (error) {
    console.error('Error reading SSL key files:', error);
    return { cert, key };
  }

  return { cert, key };
};

const ensureConfigAndSSLFiles = async () => {
  const sslDir = path.resolve('./config/ssl');
  const configFileName = 'ssl_config.cnf';

  if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir, { recursive: true });
  }

  const configFile = path.join(sslDir, configFileName);
  if (!fs.existsSync(configFile)) {
    const configContent = `
[req]
default_bits = 2048
prompt = no
default_md = sha256
x509_extensions = v3_req
distinguished_name = dn

[dn]
C = DE
ST = NW
L = Aachen
O = IhrUnternehmen
OU = IT-Abteilung
emailAddress = webmaster@server
CN = server

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.server
DNS.2 = server
`;
    await writeFileAsync(configFile, configContent);
  }
};

export const generateSSLKeys = async () => {
  await ensureConfigAndSSLFiles();

  const sslDir = path.resolve('./config/ssl');
  const baseDomain = 'server';
  const days = 1095;
  const passphrase = uuidv4();

  try {
    const keyPath = path.join(sslDir, `${baseDomain}.key`);
    const certPath = path.join(sslDir, `${baseDomain}.crt`);

    await Promise.all([
      execAsync(
        `openssl req -new -x509 -newkey rsa:2048 -sha256 -nodes -keyout ${keyPath} -days ${days} -out ${certPath} -passin pass:${passphrase} -config ${path.join(
          sslDir,
          'ssl_config.cnf',
        )}`,
      ),
      execAsync(
        `openssl x509 -noout -fingerprint -text < ${certPath} > ${path.join(
          sslDir,
          `${baseDomain}.info`,
        )}`,
      ),
    ]);

    fs.chmodSync(keyPath, 0o400);

    return { keyPath, certPath };
  } catch (err) {
    console.error('Error generating SSL keys:', err);
    throw err;
  }
};
