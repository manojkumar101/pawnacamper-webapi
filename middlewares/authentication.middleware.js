const functions = require('../helpers');
const {messages,statusCode} = require('../constants');
const { verifyCaptcha } = require('../helpers');


const authenticationController = {

  validateToken: async (req, res, next) => {
    try {
      const auth_token = req.headers['auth-token'];
      if (auth_token) {
        const tokenDecryptInfo = await functions.tokenDecrypt(auth_token);
        if (tokenDecryptInfo.data) {
          res.locals.tokenInfo = tokenDecryptInfo.data;
          const token = await functions.tokenEncrypt(tokenDecryptInfo.data);
          res.header('auth-token', token);
          next();
        } else {
          throw {
            statusCode: statusCode.unauthorized,
            message: messages.sessionExpire,
            data: {},
          };
        }
      } else {
        throw {
          statusCode: statusCode.bad_request,
          message: messages.tokenMissing,
          data: {},
        };
      }
    } catch (error) {
      next(error);
    }
  },

  validateCaptcha: async (req, res, next) => {
    try {
      
      const reCaptcha = req.headers['recaptcha'];
      if (reCaptcha) {
        const reCaptchaResp = await verifyCaptcha(reCaptcha);
        if(reCaptchaResp.success){
          next();
        }
        else{
          throw {
            statusCode: statusCode.unauthorized, 
            message: messages.captchaInvalid,
            data: {}
          };
        }
      } else {
        throw {
          statusCode: statusCode.bad_request,
          message: messages.captchaMissing,
          data: {},
        };
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authenticationController;
