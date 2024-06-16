import CryptoJS from 'crypto-js';
const config = {
  crypto: {
    secretKeys: {
      main: '87d22c0d18b0cbb0fb535fe5ec77eefcaeb78bd9dca880159d47ab5b8366ffdef4bde9a767132e8fa61514c0666aba2f7e152ea58085a28f7cd3f30186c3f54c',
      cookie:
        '6b88e2b64cd53ac54a76195c960c80d7875dc2982434eb44cbfe46f277b6cf9a0583fd8696b055bb2b42c9b12caad39165626d6fb0939db94ab211e8edeb15d1',
      session:
        '6b76dc6b0326438161de5e920ddf31161232bbe8a53aa6b278e574444e4f3e2f4fd76c25e461ac82691a6812b2889f754025d86fae9e9cd50cf45f84389525d7',
      jwt: 'a4e71a8de5f0a75432f038bf34762f00d74e097f9406748378a8e33e8c467769ada8a598479b27aa3be5e03bfab53f018e87bfa8f9fa6869105253d15f9891a2',
    },
    ivs: {
      main: 'bd9c5d343494f48e5fda9a152d2c5df8f6d1a31ade239d16de9117b1e04740a83db79dad99ab4583a1c08e0f675b56bd27c30fe54121f5dfc5f610ecce2d2ee0',
    },
  },
};

/**
 * Generate a random hexadecimal string of specified length.
 * @param {number} length - Length of the string to be generated.
 * @returns {string} - Random hexadecimal string.
 */
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

/**
 * Generate a random session secret.
 * @returns {string} - Random session secret.
 */
export const createSessionSecret = () => {
  return generateRandomBytes(16);
};

/**
 * Encrypt a given text using AES encryption.
 * @param {string|object|boolean} text - Text to be encrypted.
 * @returns {object} - Encrypted data and IV.
 * @throws {Error} - If an invalid data type is provided for encryption.
 */
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
  const parsedKey = CryptoJS.SHA256(config.crypto.secretKeys.main);

  const encrypted = CryptoJS.AES.encrypt(string, parsedKey, {
    iv: parsedIV,
    mode: CryptoJS.mode.CTR,
    format: CryptoJS.format.Hex,
  });

  return {
    data: encrypted.toString(),
    iv: iv,
  };
};

/**
 * Encrypt a given text using a local IV from the config.
 * @param {string|object|boolean} text - Text to be encrypted.
 * @returns {object|boolean} - Encrypted data and IV or false if IV is not available.
 */
export const encryptLocalIV = (text, secret = config.crypto.ivs.main) => {
  let string;
  if (typeof text === 'object') {
    string = JSON.stringify(text);
  } else if (typeof text === 'string') {
    string = text;
  } else if (typeof text === 'boolean') {
    string = text ? '1' : '0';
  } else {
    return false;
  }

  const iv = secret;
  if (!iv) return false;

  const parsedIV = CryptoJS.enc.Hex.parse(iv);
  const parsedKey = CryptoJS.SHA256(config.crypto.secretKeys.main);

  const encrypted = CryptoJS.AES.encrypt(string, parsedKey, {
    iv: parsedIV,
    mode: CryptoJS.mode.CTR,
    format: CryptoJS.format.Hex,
  });

  return {
    data: encrypted.toString(),
    iv: iv,
  };
};

/**
 * Decrypt an encrypted text using AES decryption.
 * @param {string|object} encrypted - Encrypted text or object.
 * @returns {string|object|boolean} - Decrypted text or object or false if an invalid input is provided.
 */
export const decrypt = encrypted => {
  let json;
  if (typeof encrypted === 'object') {
    json = encrypted;
  } else if (typeof encrypted === 'string') {
    json = JSON.parse(encrypted);
  } else {
    return false;
  }

  const iv = CryptoJS.enc.Hex.parse(json.iv);
  const parsedKey = CryptoJS.SHA256(config.crypto.secretKeys.main);

  const decrypted = CryptoJS.AES.decrypt(json.data, parsedKey, {
    iv: iv,
    mode: CryptoJS.mode.CTR,
  });

  try {
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
};

/**
 * Decrypt an encrypted text using a local IV from the config.
 * @param {string} encrypted - Encrypted text.
 * @returns {string|object} - Decrypted text or object.
 * @throws {Error} - If IV is not provided in config.
 */

export const decryptLocalIV = (encrypted, secret = config.crypto.ivs.main) => {
  console.log(secret);
  const iv = secret;
  if (!iv) throw new Error('IV not provided in config');

  const parsedIV = CryptoJS.enc.Hex.parse(iv);
  const parsedKey = CryptoJS.SHA256(config.crypto.secretKeys.main);

  const decrypted = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(encrypted), parsedKey, {
    iv: parsedIV,
    mode: CryptoJS.mode.CTR,
  });

  try {
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
};
