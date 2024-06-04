import uuidv4 from 'uuidv4';
// Generate a v4 (random) UUID

// Initialize the codebook using an array literal for better readability and performance
const codebook =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()-=_+[]{}|\\;:\'",.<>/? \n\r\t–—'.split(
    '',
  );

const encode = text =>
  text
    .split('')
    .map(char => {
      const codebookIndex = codebook.indexOf(char);
      return codebookIndex !== -1
        ? codebookIndex.toString().padStart(2, '0')
        : console.error('Could not encode character: ' + char);
    })
    .join('');

// This code accepts a string of numbers and converts them into the corresponding
// characters from the codebook. The codebook is an array of characters.

const decode = code => {
  if (typeof code !== 'string' || code.length % 2 !== 0) {
    return console.error('Code must be a string and an even number of characters');
  }
  return code
    .match(/.{1,2}/g)
    .map(pair => {
      const num = parseInt(pair, 10);
      return num >= 0 && num < codebook.length
        ? codebook[num]
        : console.error('Code character out of range');
    })
    .join('');
};

/* The code above does the following, explained in English:
1. The function takes the message, the key, and the mode (encrypt or decrypt) as arguments.
2. If the message or key are empty, it returns an error.
3. It then encodes the key into a code (see the encode() function below).
4. If the mode is 'encrypt' then it encodes the message into a code (see the encode() function below).
5. If the mode is 'decrypt' then it checks if the message is a number. If it is, then it sets the codeMessage to the message. If it isn't, it returns an error.
6. If the codeKey is shorter than the codeMessage, and keyRepetition is true, it will repeat the key until it is long enough. Otherwise it will return an error.
7. It then splits the codeMessage and codeKey into arrays of single numbers.
8. It then sets the codeOutput variable to an empty array.
9. It then loops through the codeMessage array.
10. It then multiplies the number at the current index in the codeMessage array by 1 (to convert it into a number, rather than a string).
11. It then multiplies the number at the current index in the codeKey array by 1 (to convert it into a number, rather than a string).
12. If the mode is 'encrypt', it then adds the codeMessage number to the codeKey number and adds the result to the codeOutput array.
13. If the mode is 'decrypt', it then subtracts the codeKey number from the codeMessage number and adds the result to the codeOutput array.
14. If the result is less than 0, it adds 10 to it.
15. It joins the codeOutput array into a string.
16. If the mode is 'decrypt', it then decodes the output string (see the decode() function below).
17. It then returns the output string. */

export const otp = (message, key, mode, keyRepetition) => {
  // If the message or key is empty, show an error and return the error
  if (message === '' || key === '') {
    var error = 'Error: The message and key must not be be empty.';
    console.error('[crypto.js] ' + error);
    return error;
  }

  // Encode the key
  var codeKey = encode(key);

  // If the mode is encrypt, encode the message
  if (mode == 'encrypt') {
    var codeMessage = encode(message);
  } else if (mode == 'decrypt') {
    // If the mode is decrypt, check the message doesn't contain any non-numbers
    if (!isNaN(message)) {
      var codeMessage = message;
    } else {
      var error = 'Error: When decrypting, the message must only contain numbers.';
      console.error('[crypto.js] ' + error);
      return error;
    }
  }

  // If the key is shorter than the message, either show an error or repeat the key until it's long enough
  if (codeKey.length < codeMessage.length) {
    if (keyRepetition === true) {
      while (codeKey.length < codeMessage.length) {
        codeKey += codeKey;
      }
    } else {
      var error = 'Error: The key is shorter than the message.';
      console.error('[crypto.js] ' + error);
      return error;
    }
  }
  // Convert the codeMessage and codeKey strings into arrays of numbers
  codeMessage = codeMessage.split('');
  codeKey = codeKey.split('');
  var codeOutput = [];

  // Loop through the arrays, add or subtract the numbers depending on the mode, and push the result into the codeOutput array
  for (var i = 0; i < codeMessage.length; i++) {
    codeMessage[i] *= 1;
    codeKey[i] *= 1;
    if (mode == 'encrypt') {
      codeOutput[i] = codeMessage[i] + codeKey[i];
      if (codeOutput[i] > 9) {
        codeOutput[i] -= 10;
      }
    }
    /*
     * This code converts the message into the output, based on the mode
     * and the key.
     */
    if (mode == 'decrypt') {
      codeOutput[i] = codeMessage[i] - codeKey[i];
      if (codeOutput[i] < 0) {
        codeOutput[i] += 10;
      }
    }
  }

  // Convert the codeOutput array into a string
  var outputString = codeOutput.join('');

  // If the mode is decrypt, decode the output string and return it
  if (mode == 'decrypt') {
    return decode(outputString);
  } else {
    // If the mode is encrypt, return the output string
    return outputString;
  }
};

/* The code above does the following, explained in English:
1. Define an "iv" variable as a random uuidv4.
2. Define an "encrypt" function which takes a "plainText" argument.
3. The function checks if the "plainText" argument is null or empty.
4. If so, it returns null.
5. It then defines a "isLonger" variable as false.
6. If the length of the "iv" variable is less than the length of the "plainText" argument, it sets "isLonger" to true.
7. It then logs the value of "isLonger" to the console.
8. It defines a "cipher" variable as the output of the "otp" function, which takes the "plainText" argument, the "iv" variable, the string "encrypt" and the "isLonger" variable as arguments.
9. It then logs the value of "cipher" to the console.
10. It then returns an object with the properties "iv" and "content", both of which are set to the "iv" variable and the "cipher" variable respectively. */

export const encrypt = plainText => {
  const iv = uuidv4();
  // Check if the plain text is null or empty
  if (!plainText && typeof plainText === 'string') return null;
  // Encrypt the plain text
  const cipher = otp(plainText, iv, 'encrypt', iv.length < plainText.length);
  // Return the cipher text
  return {
    iv: iv,
    content: cipher,
  };
};

/* The code above does the following, explained in English:
1. Checks if the input is valid (not null or empty, and is an object)
2. Runs the OTP function (see below) with the content and IV of the cipher, and specifies the operation as 'decrypt'
3. Returns the decrypted text */
export const decrypt = cipher => {
  if (!cipher || typeof cipher !== 'object') return false;
  return otp(cipher.content, cipher.iv, 'decrypt', cipher.iv.length < cipher.content.length);
};

/* Exporting the functions `encrypt`, `decrypt`, and `otp` so that they can be used in other files. */
