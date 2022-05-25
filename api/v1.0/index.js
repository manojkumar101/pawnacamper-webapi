var express = require('express');
var router = express.Router();

// require('./modules/web3/events');
// require('./modules/cron-job/delete-node.cron');
const userRouter = require('./modules/user/routes');
const nodeRouter = require('./modules/node/routes');

router.get('/', function (req, res) {
  res.send('Hello v1.0 GET API');
});

router.post('/', function (req, res) {
  res.send('Hello v1.0 POST API');
});

router.use('/user', userRouter);
router.use('/node', nodeRouter);


module.exports = router;