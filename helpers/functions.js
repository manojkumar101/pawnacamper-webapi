const config = require('../config');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
// const axios = require('axios').default;
const fetch = require('node-fetch').default;


/**
 * Function for Encrypting the data
 * @param {*} data (data to encrypt)
 * @param {*} return (encrypted data)
 */
function encryptData(data) {
  if (config.bodyEncryption) {
    var dataString = JSON.stringify(data);
    var response = CryptoJS.AES.encrypt(dataString, config.error);
    return { encResponse: response.toString() };
  }
  return data;
}

/**
 * Function for decrypting the data
 * @param {*} data (data to decrypt)
 * @param {*} return (decrypt data)
 */
function decryptData(data) {
  if (config.bodyEncryption) {
    var decrypted = CryptoJS.AES.decrypt(data, config.CRYPTO_KEY);
    if (decrypted) {
      var userinfo = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      return userinfo;
    } else {
      return { userinfo: { error: 'Please send proper token' } };
    }
  }
  return data;
}

/**
 * Function for Encrypting the password
 * @param {*} data (data to encrypt)
 * @param {*} return (encrypted data)
 */
function encryptPassword(data) {
  var response = CryptoJS.AES.encrypt(data, config.TOKEN_KEY);
  return response.toString();
}

/**
 * Function for decrypting the password
 * @param {*} data (data to decrypt)
 * @param {*} return (decrypt data)
 */
function decryptPassword(data) {
  var decrypted = CryptoJS.AES.decrypt(data, config.TOKEN_KEY);
  if (decrypted) {
    var userinfo = decrypted.toString(CryptoJS.enc.Utf8);
    return userinfo;
  } else {
    return { userinfo: { error: 'Please send proper token' } };
  }
}

/**
 * Function for encryting the userId with session
 * @param {*} data (data to encrypt)
 * @param {*} return (encrypted data)
 */
async function tokenEncrypt(data, expires = true) {
  var token;
  if (expires) {
    token = await jwt.sign({ data: data }, config.TOKEN_KEY, {
      expiresIn: '2h',
    }); // Expires in 1 day
  } else {
    token = await jwt.sign({ data: data }, config.TOKEN_KEY); // Does not Expire
  }
  return token;
}

/**
 * Function for decryting the userId with session
 * @param {*} data (data to decrypt)
 * @param {*} return (decrypted data)
 */
async function tokenDecrypt(data) {
  try {
    const decode = await jwt.verify(data, config.TOKEN_KEY);
    return decode;
  } catch (error) {
    return error;
  }
}

/**
 * Function for creating response
 * @param {*} data (status, data, token)
 * @param {*} return (encrypted data)
 */
function responseGenerator(statusCode, message, data = '') {
  var details = {
    statusCode: statusCode || 422,
    message: message,
    result: data,
  };

  if (config.bodyEncryption) {
    return encryptData(details);
  } else {
    return details;
  }
}

/**
 * Function for sending email
 * @param {*} data (to, sub)
 * @param {*} return (decrypted data)
 */
async function sendEmail(to, subject, message) {
  var transporter = nodemailer.createTransport({
    name: config.SMTPHost,
    host: config.SMTPHost,
    port: 465,
    secure: true,
    auth: {
      user: config.SMTPemailAddress,
      pass: config.SMTPPassword,
    },
  });

  var mailOptions = {
    from: `${config.SMTPFromName}<${config.SMTPemailAddress}>`,
    to: to,
    subject: subject,
    html: message,
  };
  try {
    const smsDetails = await transporter.sendMail(mailOptions);
    return smsDetails;
  } catch (error) {
    console.log('error', error);
    // errorHandler(error);
  }
}

/* 
  Generate random string of specific size, 
  which used  for generating random password in create user by admin.
*/
function randomPasswordGenerater(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Function for Uploading file
 * @param {*} data (image information)
 * @param {*} return (uploaded information)
 */
async function uploadFile(fileInfo) {
  // eslint-disable-next-line no-useless-catch
  try {
    var base64 = fileInfo.base64.split(';base64,')[1];
    var fileBuffer = Buffer.from(base64, 'base64');
    await fs.writeFileSync(fileInfo.key, fileBuffer, 'utf8');
    return 1;
  } catch (e) {
    throw e;
  }
}

/**
 * Function for recaptcha
 */
async function verifyCaptcha(captchaToken) {
  // eslint-disable-next-line no-useless-catch
  try {
    const captchaResp = await fetch(config.CAPTCHA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${config.CAPTCHA_SECRET}&response=${captchaToken}`,
    });
    const result = await captchaResp.json();
    return result;
  } catch (e) {
    throw e;
  }
}



module.exports = {
  encryptData,
  decryptData,
  encryptPassword,
  decryptPassword,
  tokenEncrypt,
  tokenDecrypt,
  responseGenerator,
  sendEmail,
  randomPasswordGenerater,
  uploadFile,
  verifyCaptcha
};
