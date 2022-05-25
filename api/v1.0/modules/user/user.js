const con = require('../../../../helpers');
const util = require('util');
const query = util.promisify(con.query).bind(con);
const functions = require('../../../../helpers');
// const config = require('../../../../config');
// const validator = require('validator');
const { messages, statusCode } = require('../../../../constants');


class UserService {
  /**
   * @description - Function to connect wallet i.e login/signup the user
   * @param {*} info - request body data of user to connect wallet
   */
  async connectWallet(info) {
    try {
      let walletAdress = info.wallet_address ? info.wallet_address : null;

      if (!walletAdress) {
        return {
          code: statusCode.bad_request,
          message: messages.invalidDetails,
          data: {},
        };
      }
  
      walletAdress = await web3Function.getCheckedSumAddress(walletAdress);

      const msqlProcedureCall = 'call connectWallet(?)';
      const userDbResp = await query(msqlProcedureCall, [walletAdress]);

      if (!userDbResp[0][0]) {
        return {
          code: statusCode.internal_server_error,
          message: messages.noData,
          data: {},
        };
      }

      const userDetails = userDbResp[0][0];
      const token = await functions.tokenEncrypt(userDetails);
      const userInfo = {
        wallet_address: userDetails.wallet_address,
        auth_token: token
      };
      return {
        code: statusCode.success,
        message: messages.success,
        data: userInfo,
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }

  /**
   * @description - Function to create a node
   * @param {*} info - request body data of user create a node
   */
  async submitNode(info, tokenInfo) {
    try {
      let { description, node_name } = info;

      if (!node_name || !description) {
        return {
          code: statusCode.bad_request,
          message: messages.invalidDetails,
          data: {},
        };
      }
      const domainValid = isValidDomain(`${node_name}.emeraldnodes.finance`, {
        subdomain: true,
      });

      if (!domainValid) {
        return {
          code: statusCode.bad_request,
          message: messages.invalidSubDomain,
          data: {},
        };
      }
      node_name = node_name.trim();
      const walletAddress = tokenInfo.wallet_address;
      const userId = tokenInfo.user_id;

      // const msqlqueryCall = 'select count(id) as count from node where name =  ? and is_deleted = 0';
      const nodeNameAlreadyExist = await commondbObj.commonDb().getNode({node_name});
      console.log(nodeNameAlreadyExist);
      if(Object.keys(nodeNameAlreadyExist).length !== 0){
        return{
          code: statusCode.conflict, 
          message: messages.nodeExist, 
          data: {}
        };
      } 

      const https_endpoint = `https://${node_name}.emeraldnodes.finance/ext/bc/C/rpc`;
      const wss_endpoint = `wss://${node_name}.emeraldnodes.finance/ws`;
      const data = {
        userId,
        wallet_address: walletAddress,
        node_name,
        description,
        https_endpoint,
        wss_endpoint,
      };
      console.log("before submit node");
      const nodeDetails = await commondbObj.commonDb().submitNode(data);
      console.log("After submit node");
      // const nodeDetails = {};
      return {
        code: statusCode.success,
        message: messages.success,
        data: {
          node_id: nodeDetails.node_id,
        },
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }

  /**
   * @description - Function to get the reward details pf the user
   * @param {*} tokenInfo - token passed in the header auth-token
   */
  async getReward(tokenInfo) {
    try {
      const wallet_address = tokenInfo.wallet_address;

      const msqlProcedureCall = 'call getReward(?);';
      const rewardDBResp = await query(msqlProcedureCall, [wallet_address]);

      if (!rewardDBResp[0][0]) {
        return {
          code: statusCode.internal_server_error,
          message: messages.noData,
          data: {},
        };
      }

      const rewardDetails = rewardDBResp[0][0];

      return {
        code: statusCode.success,
        message: messages.success,
        data: rewardDetails,
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }

  /**
   * @description - Function to get the claimed reward details pf the user
   * @param {*} tokenInfo - token passed in the header auth-token
   * @param {*} options - query params
   */
  async getClaimedRewardList(options, tokenInfo) {
    try {
      const wallet_address = tokenInfo.wallet_address;
      const limit = options.limit ? parseInt(options.limit) : null;
      let offset = options.offset ? parseInt(options.offset) : null;

      offset = (offset - 1) * limit;
      const mysqlProcedureCall = 'call getClaimedRewardList(?,?,?)';

      const claimedRewardListDBResp = await query(mysqlProcedureCall, [
        wallet_address,
        offset,
        limit,
      ]);

      if (!claimedRewardListDBResp[0][0]) {
        return {
          code: statusCode.internal_server_error,
          message: messages.noData,
          data: {},
        };
      }

      const claimedRewardList = JSON.parse(
        claimedRewardListDBResp[0][0].result
      );

      return {
        code: statusCode.success,
        message: messages.success,
        data: claimedRewardList,
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }

  async getTransactionHistoryList(options, tokenInfo) {
    try {
      const userId = tokenInfo ? tokenInfo.user_id : null;
      const limit = options.limit ? parseInt(options.limit) : null;
      const offset = options.limit
        ? parseInt((options.offset - 1) * limit)
        : null;
      let sort_by = options.sort_by ? options.sort_by : '';
      let order_by = options.order_by ? options.order_by : '';

      // console.log('userId', userId);
      const mysqlProcedureCall =
        'call getTransactionHistoryList(?, ?, ?, ?, ?)';

      const transactionHistoryList = await query(mysqlProcedureCall, [
        userId,
        sort_by,
        order_by,
        offset,
        limit,
      ]);

      // console.log(transactionHistoryList[0][0]);
      if (!transactionHistoryList[0][0]) {
        return {
          code: statusCode.internal_server_error,
          message: messages.noData,
          data: {},
        };
      }

      const transactionHistory = await JSON.parse(
        transactionHistoryList[0][0].result
      );

      return {
        code: statusCode.success,
        message: messages.success,
        data: transactionHistory,
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }

  async getRewardList(tokenInfo, options) {
    try {
      const wallet_address = tokenInfo.wallet_address;
      const limit = options.limit ? parseInt(options.limit) : null;
      let offset = options.offset ? parseInt(options.offset) : null;

      offset = (offset - 1) * limit;
      const mysqlProcedureCall = 'call getRewardList(?,?,?)';

      const rewardListDBResp = await query(mysqlProcedureCall, [
        wallet_address,
        offset,
        limit,
      ]);

      if (!rewardListDBResp[0][0]) {
        return {
          code: statusCode.internal_server_error,
          message: messages.noData,
          data: {},
        };
      }

      const rewardList = await JSON.parse(rewardListDBResp[0][0].result);

      return {
        code: statusCode.success,
        message: messages.success,
        data: rewardList,
      };
    } catch (error) {
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }
  async getRewardMetaData(tokenInfo) {
    try {
      const wallet_address = tokenInfo.wallet_address;
      // console.log("enode contract", emeraldNodesContract)
      let result = await emeraldNodesContract.methods
        .viewTotalReward(wallet_address)
        .call();
      console.log(result);
      let TotalUserReward = await web3.utils.fromWei(result.TotalUserReward, 'ether');
      let RewardAlreadyClaimed = await web3.utils.fromWei(
        result.RewardAlreadyClaimed,
        'ether'
      );
      let RewardToBeClaimed =await web3.utils.fromWei(
        result.RewardToBeClaimed,
        'ether'
      );

      let finalOutput = {
        TotalUserReward,
        RewardAlreadyClaimed,
        RewardToBeClaimed,
      };

      return {
        code: statusCode.success,
        message: messages.success,
        data: finalOutput,
      };
    } catch (error) {

      if(error.message === messages.executionReverted){
        return {
          code: statusCode.success,
          message: messages.success,
          data: {}
        };
      }

      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }
  async getRewardHistory(tokenInfo) {
    try {
      // const wallet_address = tokenInfo.wallet_address;
      
      const wallet_address = tokenInfo.wallet_address;

      let result = await emeraldNodesContract.methods
        .viewAllDetails(wallet_address)
        .call();
      let {
        NodeIds,
        TierIds,
        TotalNodeRewards,
        RewardAlreadyClaimeds,
        RewardToBeClaimeds,
      } = result;
    
      let getQuery='select id as node_id, wallet_address, tier_id,contract_generated_node_id,name as node_name ,node_status,created_utc_date from  node where wallet_address = ? and contract_generated_node_id is not null;';
      let nodeData=await query(getQuery,[wallet_address]);
      
      let finalResponse=[];
      let recordLength=NodeIds.length;
      for(let i=0;i<recordLength ;i++){
        let NodeObject= nodeData.filter((obj)=>{
          return obj.contract_generated_node_id && Number(obj.contract_generated_node_id) == Number(NodeIds[i]);
        });
        // console.log(NodeObject);
        // console.log(nodeData);
        let TotalReward =await web3.utils.fromWei(TotalNodeRewards[i], 'ether');
        let claimedReward = await web3.utils.fromWei(RewardAlreadyClaimeds[i], 'ether');
        let availableReward = await web3.utils.fromWei(RewardToBeClaimeds[i], 'ether');

        let recordObject={
          contractGeneratedNodeId: Number(NodeIds[i]),
          NodeId: NodeObject.length ? NodeObject[0].node_id : '',
          NodeName : NodeObject.length ? NodeObject[0].node_name : 'Not Available',
          TierId :Number(TierIds[i]),
          TotalReward,
          claimedReward,
          availableReward,
          created_at:NodeObject.length ? NodeObject[0].created_utc_date : 'Not Available',
        };
        if(recordObject.TotalReward > 0)
        { 
          finalResponse.push(recordObject);
        }
      }

      return {
        code: statusCode.success,
        message: messages.success,
        data: finalResponse,
      };
    } catch (error) {
      console.log('getRewardMetaData ~ error', error);
      if(error.message === messages.executionReverted){
        return {
          code: statusCode.success,
          message: messages.success,
          data: {}
        };
      }
      throw {
        code: statusCode.internal_server_error,
        message: error.message,
        data: {},
      };
    }
  }
}
module.exports = {
  userService: function () {
    return new UserService();
  },
};
