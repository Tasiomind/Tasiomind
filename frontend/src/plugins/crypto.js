import CryptoJS from 'crypto-js';

const cryptoKey = 'secretKey';

export const encrypt = text => {
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
  const iv = randomBytes(16);
  let parsed_iv = CryptoJS.enc.Hex.parse(iv);
  const parsedKey = CryptoJS.SHA256(cryptoKey);
  const encrypted = CryptoJS.AES.encrypt(string, parsedKey, {
    iv: parsed_iv,
    mode: CryptoJS.mode.CTR,
    format: CryptoJS.format.Hex,
  });
  return {
    data: encrypted.toString(),
    iv: iv,
  };
};

export const randomBytes = length => {
  length = Math.floor(length);
  let bytes = '';
  for (let index = 0; index < length; index++) {
    let result = parseInt((Math.random() * 256).toString(), 10).toString(16);
    result = result.padStart(2, '0');
    bytes += result;
  }
  return bytes;
};

export const createSessionSecret = () => {
  return randomBytes(16);
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
  const parsedKey = CryptoJS.SHA256(cryptoKey);
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
