const responseFormater=(statusCode, message, data = '')=> {
  var responseData = {
    code: statusCode || 422,
    message: message,
    result: data,
  };
  
  return responseData;
};
module.exports={
  responseFormater
};