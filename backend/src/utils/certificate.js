import forge from 'node-forge';
import fs from 'fs/promises';
import path from 'path';

export const generateCertificate = async (
  pemDirectory = null,
  validityDays = 365,

  {
    attrs = [
      { name: 'commonName', value: 'localhost' },
      { name: 'countryName', value: 'US' },
      { name: 'stateOrProvinceName', value: 'California' },
      { name: 'localityName', value: 'Berkeley' },
      { name: 'organizationName', value: 'Test' },
      { name: 'organizationalUnitName', value: 'Test' },
    ],
  } = {},
) => {
  const keys = forge.pki.rsa.generateKeyPair(2048);

  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + validityDays);
    cert.validity.notAfter = expirationDate;
  }

  {
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
  }

  cert.sign(keys.privateKey);
  if (pemDirectory != null) {
    await writePemFiles(path.resolve(pemDirectory), {
      cert: forge.pki.certificateToPem(cert),
      key: forge.pki.privateKeyToPem(keys.privateKey),
      publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    });
  }
  return {
    cert: forge.pki.certificateToPem(cert),
    key: forge.pki.privateKeyToPem(keys.privateKey),
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
  };
};

export const generateCertificateFromCSR = csr => {
  const keys = forge.pki.rsa.generateKeyPair(2048);

  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    cert.validity.notAfter = expirationDate;
  }

  cert.setSubject(csr.subject.attributes);
  cert.setIssuer(csr.subject.attributes);
  cert.sign(keys.privateKey);

  return {
    cert: forge.pki.certificateToPem(cert),
    key: forge.pki.privateKeyToPem(keys.privateKey),
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
  };
};

export const makeCSR = ({
  attrs = [
    { name: 'commonName', value: 'localhost' },
    { name: 'countryName', value: 'US' },
    { name: 'stateOrProvinceName', value: 'California' },
    { name: 'localityName', value: 'Berkeley' },
    { name: 'organizationName', value: 'Test' },
    { name: 'organizationalUnitName', value: 'Test' },
  ],
  keys = forge.pki.rsa.generateKeyPair(2048),
} = {}) => {
  const csr = forge.pki.createCertificationRequest();
  csr.publicKey = keys.publicKey;
  csr.setSubject(attrs);
  csr.sign(keys.privateKey);

  return {
    csr: forge.pki.certificationRequestToPem(csr),
    keys,
  };
};

export const makeCSRFromCert = cert => {
  const keys = forge.pki.rsa.generateKeyPair(2048);

  const csr = forge.pki.createCertificationRequest();
  csr.publicKey = keys.publicKey;
  csr.setSubject(cert.subject.attributes);
  csr.sign(keys.privateKey);

  return {
    csr: forge.pki.certificationRequestToPem(csr),
    keys,
  };
};

export const writePemFiles = async (directoryPath, { key, publicKey, cert }) => {
  const normalizedPath = directoryPath.endsWith('/') ? directoryPath : `${directoryPath}/`;

  await fs.writeFile(`${normalizedPath}private.pem`, key, 'utf8');
  await fs.writeFile(`${normalizedPath}public.pem`, publicKey, 'utf8');
  await fs.writeFile(`${normalizedPath}certificate.pem`, cert, 'utf8');
};
