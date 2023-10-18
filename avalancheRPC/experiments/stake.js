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

// Function to parse command-line arguments
function parseCommandLineArgs() {
    nodeID = process.argv[2];
}

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
        parseCommandLineArgs();
        // issue tx
        params = {
            "nodeID": nodeID,
            "amount": 10,
            "from": [userInfo["P"]],
            "changeAddr": userInfo["P"],
            "memo": "hi, mom!",
            "stakeAmount": 1000000,
            "startTime": '$(date --date="10 minutes" +%s)',
            "endTime": '$(date --date="2 days" +%s)',
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


