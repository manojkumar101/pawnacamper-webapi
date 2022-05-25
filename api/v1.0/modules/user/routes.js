const router = require('express').Router();
const api = require('./controller');
const authentication = require('../../../../middlewares');

router.post('/connect-wallet',  api.connectWallet);
router.post('/create-node',authentication.validateToken, api.submitNode);
module.exports = router;