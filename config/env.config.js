
const env = require('dotenv');
env.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

const  {
  NODE_ENV,
  PORT,
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  SECRET_KEY,
  CRYPTO_KEY,
  TOKEN_KEY,
  SMTPHost,
  API_HOST ,
  SMTPemailAddress,
  SMTPPassword,

} = process.env;

module.exports={

  NODE_ENV,
  PORT:parseInt(PORT),
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  API_HOST ,
  SECRET_KEY,
  CRYPTO_KEY,
  TOKEN_KEY,
  SMTPHost,
  SMTPemailAddress,
  SMTPPassword
};
