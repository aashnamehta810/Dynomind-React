import CryptoJS from 'crypto-js';
import { deleteRememberMeToken, setRememberMeToken } from '@app/services/localStorage.service';
import { DecryptUserData, EncryptionData } from '@app/interfaces/interfaces';

// Encryption of Login Data
export const cryptoEncrpytHandler = (data: EncryptionData): string => {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    `${process.env.REACT_APP_REMEMBERME_SECRET_KEY}`,
  ).toString();

  const { rememberMe } = data;

  if (rememberMe === true) {
    setRememberMeToken(ciphertext);
  } else {
    deleteRememberMeToken('rememberMe');
  }

  return ciphertext;
};

// Decryption of Login Data
export const cryptoDecryptHandler = (str: string): DecryptUserData => {
  const bytes = CryptoJS.AES.decrypt(str, `${process.env.REACT_APP_REMEMBERME_SECRET_KEY}`);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};
