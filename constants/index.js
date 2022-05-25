
const environments = require('./environments.constant');
const roles= require('./roles.constant');
const messages=require('./common.message');
const statusCode=require('./status.codes');
module.exports={
  ...environments,
  ...roles,
  ...messages,
  ...statusCode
};