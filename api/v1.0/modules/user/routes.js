const router = require('express').Router();
const api = require('./controller');
const authentication = require('../../../../middlewares');

router.post('/connect-wallet',  api.connectWallet);
router.post('/create-node',authentication.validateToken, api.submitNode);
router.get('/node-list', authentication.validateToken, api.getMyNodeList);
router.get('/claimed-reward-list', authentication.validateToken, api.getClaimedRewardList);
router.get('/transaction-history', authentication.validateToken, api.getTransactionHistoryList);
router.get('/reward-meta-data',authentication.validateToken, api.getRewardMetaData);
router.get('/reward-history',authentication.validateToken, api.getRewardHistory);
module.exports = router;