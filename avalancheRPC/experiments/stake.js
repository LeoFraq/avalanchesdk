// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';

import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';


// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"

// Initialize default values
let methodName = 'platform.addValidator';
let params = {};
let nodeID = ""



/**
 * {
        "nodeID":"NodeID-ARCLrphAHZ28xZEBfUL7SVAmzkTZNe1LK",
        "rewardAddress":"P-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5",
        "from": ["P-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
        "changeAddr": "P-avax103y30cxeulkjfe3kwfnpt432ylmnxux8r73r8u",
        "startTime":'$(date --date="10 minutes" +%s)',
        "endTime":'$(date --date="2 days" +%s)',
        "stakeAmount":1000000,
        "delegationFeeRate":10,
        "username":"myUsername",
        "password":"myPassword"
    }
 */
const main = async () => {
    try {
        let userInfo = await loadOrGenerateUserInfo();
        userInfo = await verifyUserInfoHasAccount(userInfo);
        nodeID = getNodeId();
        const now = new Date();
        const startDate = new Date(now.getTime() + 1 * 60 * 1000); // 1 minutes in milliseconds
        const endDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days in milliseconds

        const timestampStart = Math.floor(startDate.getTime() / 1000);
        const timestampEnd = Math.floor(endDate.getTime() / 1000);
        // issue tx
        params = {
            "nodeID": nodeID,
            "amount": 10,
            "from": [userInfo["P"]],
            "changeAddr": userInfo["P"],
            "memo": "hi, mom!",
            "stakeAmount": 1000000,
            "startTime": timestampStart,
            "endTime": timestampEnd,
            "rewardAddress": userInfo["P"],
            "username": userInfo.account.accountName,
            "password": userInfo.account.pwd
        }
        // Call the function
        const result = await requestProcessor(methodName, params);
        console.log("results:", result, " \n")
    } catch (error) {
        console.error('Error occurred:', error.message);
        // Continue with your error handling logic, if needed
    }
};


main()

/**
 * curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.getNodeID"
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
 */
async function getNodeId() {
    let methodName = "info.getNodeID"
    let params = {}
    const result = await requestProcessor(methodName, params);
    console.log("Result of getNodeID", result)
    return result.nodeID
}