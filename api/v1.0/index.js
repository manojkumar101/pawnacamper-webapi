var express = require('express');
var router = express.Router();

const userRouter = require('./modules/user/routes');
router.get('/', function (req, res) {
  res.send('Hello v1.0 GET API');
});

router.post('/', function (req, res) {
  res.send('Hello v1.0 POST API');
});

router.use('/user', userRouter);


module.exports = router;