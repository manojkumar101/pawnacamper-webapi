const functions=require('./functions');
const dbInstance=require('./mysql.db.instance');

module.exports={
  ...functions,
  ...dbInstance
};

