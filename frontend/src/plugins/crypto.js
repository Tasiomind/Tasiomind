import CryptoJS from 'crypto-js';
const config = {
  iv: '4c9f0051424de04dc72074ad3506701b',
  cryptoKey: 'secretKey',
};

export const generateRandomBytes = length => {
  length = Math.floor(length);
  let bytes = '';
  for (let i = 0; i < length; i++) {
    let result = parseInt((Math.random() * 256).toString(), 10).toString(16);
    result = result.padStart(2, '0');
    bytes += result;
  }
  return bytes;
};

export const createSessionSecret = () => {
  return generateRandomBytes(16);
};

export const encrypt = text => {
  let string;
  if (typeof text === 'object') {
    string = JSON.stringify(text);
  } else if (typeof text === 'string') {
    string = text;
  } else if (typeof text === 'boolean') {
    string = text ? '1' : '0';
  } else {
    throw new Error('Invalid data type for encryption');
  }

  const iv = generateRandomBytes(16);
  const parsedIV = CryptoJS.enc.Hex.parse(iv);
  const parsedKey = CryptoJS.SHA256(config.cryptoKey);

  const encrypted = CryptoJS.AES.encrypt(string, parsedKey, {
    iv: parsedIV,
    mode: CryptoJS.mode.CTR,
    format: CryptoJS.format.Hex,
  });

  return {
    data: encrypted.toString(),
    iv: config.iv,
  };
};

export const encryptLocalIv = text => {
  let string;
  if (typeof text == 'object') {
    string = JSON.stringify(text);
  } else if (typeof text == 'string') {
    string = text;
  } else if (typeof text == 'boolean') {
    string = text ? '1' : '0';
  } else {
    return false;
  }

  const parsedIV = CryptoJS.enc.Hex.parse(config.iv);
  const parsedKey = CryptoJS.SHA256(config.cryptoKey);
  const encrypted = CryptoJS.AES.encrypt(string, parsedKey, {
    iv: parsedIV,
    mode: CryptoJS.mode.CTR,
    format: CryptoJS.format.Hex,
  });

  return encrypted.toString();
};

export const decrypt = encrypted => {
  let json;
  if (typeof encrypted == 'object') {
    json = encrypted;
  } else if (typeof encrypted == 'string') {
    json = JSON.parse(encrypted);
  } else {
    return false;
  }
  const iv = CryptoJS.enc.Hex.parse(json.iv);
  const parsedKey = CryptoJS.SHA256(config.cryptoKey);
  const decrypted = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(json.data), parsedKey, {
    iv: iv,
    mode: CryptoJS.mode.CTR,
  });
  try {
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
};

export const decryptLocalIV = encrypted => {
  let json;
  if (typeof encrypted === 'object') {
    json = encrypted;
  } else if (typeof encrypted === 'string') {
    json = JSON.parse(encrypted);
  } else {
    throw new Error('Invalid data type for decryption');
  }

  if (!iv) throw new Error('IV not provided in config');

  const parsedIV = CryptoJS.enc.Hex.parse(config.iv);
  const parsedKey = CryptoJS.SHA256(config.cryptoKey);

  const decrypted = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(json.data), parsedKey, {
    iv: parsedIV,
    mode: CryptoJS.mode.CTR,
  });

  try {
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
};
