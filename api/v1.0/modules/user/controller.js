const userServiceObject = require('./user');
const {responseFormater}= require('../../../../utils');
const logger = require('../../../../helpers/logger');
const { messages, statusCode } = require('../../../../constants');

const controller = {

  //connecting-wallet controller 
  connectWallet: async (req, res, next) => {
    try{
      const userDetails = await userServiceObject
        .userService()
        .connectWallet(req.body);

      res.status(userDetails.code);
      res.send(
        responseFormater(
          userDetails.code,
          userDetails.message,
          userDetails.data
        )
      );
    }catch(error){
      logger.serverLogger(error);
      next(error);
    }
  },

  // init node creation controller
  submitNode: async (req, res, next) => {
    try{
      const nodeDetails =  await userServiceObject
        .userService()
        .submitNode(req.body, res.locals.tokenInfo);

      res.status(nodeDetails.code);
      res.send(
        responseFormater(
          nodeDetails.code,
          nodeDetails.message,
          nodeDetails.data
        )
      );
    }catch(error){
      logger.serverLogger(error);
      next(error);
    }
  },

  //retrive user specific node
  getMyNodeList: async (req, res, next) => {
    try{
      if(!res.locals.tokenInfo.user_id){
        throw {
          code: statusCode.unauthorized, 
          message: messages.tokenIssue, 
          data: {}
        };
      }
      const nodeDetails =  await commonObj
        .commonService()
        .getNodeList(req.query, res.locals.tokenInfo);

      res.status(nodeDetails.code);
      res.send(
        responseFormater(
          nodeDetails.code,
          nodeDetails.message,
          nodeDetails.data
        )
      );
    }catch(error){
      logger.serverLogger(error);
      next(error);
    }
  },

  //all user claimed list
  getClaimedRewardList: async (req, res, next) => {
    try{
      console.log(res.locals.tokenInfo);
      const claimedRewardList = await userServiceObject
        .userService()
        .getClaimedRewardList(req.query, res.locals.tokenInfo);

      res.status(claimedRewardList.code);
      res.send(
        responseFormater(
          claimedRewardList.code,
          claimedRewardList.message,
          claimedRewardList.data
        )
      );
    }catch(error){
      logger.serverLogger(error);
      next(error);
    }
  },

  //all user claimed list
  getTransactionHistoryList: async (req, res, next) => {
    try{
     
      const transactionHistory = await userServiceObject
        .userService()
        .getTransactionHistoryList(req.query, res.locals.tokenInfo);

      res.status(transactionHistory.code);
      res.send(
        responseFormater(
          transactionHistory.code,
          transactionHistory.message,
          transactionHistory.data
        )
      );
    }catch(error){
      logger.serverLogger(error);
      next(error);
    }
  },

  // reward controller
  getReward: async (req, res, next) => {
    try{

      const rewardDetails = await userServiceObject
        .userService()
        .getReward(res.locals.tokenInfo);

      res.status(rewardDetails.code);
      res.send(
        responseFormater(
          rewardDetails.code,
          rewardDetails.message,
          rewardDetails.data
        )
      );
    }catch(error){
      logger.serverLogger(error);
      next(error);
    }
  },
  
  //all claimed list
  getRewardList: async (req, res, next) => {
    try{
      console.log(res.locals.tokenInfo);
      const rewardList = await userServiceObject
        .userService()
        .getRewardList(res.locals.tokenInfo, req.query);

      res.status(rewardList.code);
      res.send(
        responseFormater(
          rewardList.code,
          rewardList.message,
          rewardList.data
        )
      );
    }catch(error){
      logger.serverLogger(error);
      next(error);
    }
  },
  //get Reward Meta Data
  getRewardMetaData: async (req, res, next) => {
    try{
    
      const metadata = await userServiceObject
        .userService()
        .getRewardMetaData(res.locals.tokenInfo);

      res.status(metadata.code);
      res.send(
        responseFormater(
          metadata.code,
          metadata.message,
          metadata.data
        )
      );
    }catch(error){
      logger.serverLogger(error);
      next(error);
    }
  },
  //getRewardHistory
  getRewardHistory: async (req, res, next) => {
    try{
    
      const rewarddata = await userServiceObject
        .userService()
        .getRewardHistory(res.locals.tokenInfo,req);

      res.status(rewarddata.code);
      res.send(
        responseFormater(
          rewarddata.code,
          rewarddata.message,
          rewarddata.data
        )
      );
    }catch(error){
      logger.serverLogger(error);
      next(error);
    }
  },
};


module.exports = controller;
