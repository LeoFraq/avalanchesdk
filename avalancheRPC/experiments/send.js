// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';

import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';


// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"

// Initialize default values
let methodName = 'avm.send';
let params = {};
let iterations = 1

// Function to parse command-line arguments
function parseCommandLineArgs() {
    iterations = process.argv[2];
}


const main = async () => {
    try {
        let userInfo = await loadOrGenerateUserInfo();
        userInfo = await verifyUserInfoHasAccount(userInfo);
        parseCommandLineArgs();
        // params = argv
        if (!methodName) {
            throw new Error('Method name not provided or not found:'.concat(methodName));
        }
        // validation
        // verify send multiple
        const bl = await verifyBalance("X", userInfo["X"])
        if (Number(bl.result.balance) > 0) {
            let waitTime = 250
            console.log("Balance:", bl)
            // issue tx
            for (let i = 0; i < iterations; i++) {
                params = {
                    "assetID": assetID,
                    "amount": 10,
                    "to": setupKeys[i % 4].x,
                    "from": [userInfo["X"]],
                    "changeAddr": userInfo["X"],
                    "memo": "hi, mom!",
                    "username": userInfo.account.accountName,
                    "password": userInfo.account.pwd
                }
                // Call the function
                const result = await requestProcessor(methodName, params);
                console.log(i, ": results:", result, " \n")
                waitTime = calculateWaitTime(result, waitTime)
                // Delay for 100ms before the next invocation
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        } else {
            console.error("Balance is wrong", bl)
        }

    } catch (error) {
        console.error('Error occurred:', error.message);
        // Continue with your error handling logic, if needed
    }
};


main()



function calculateWaitTime(result, waitTime) {
    if (result.result && result.result.txID) {
        waitTime -= 50;
    } else if (result.error) {
        // JSON-RPC response is in "increase" format
        waitTime += 100; // Increase wait time by 100ms
    } else {
        // A straight up error
        console.error("How did you get here?")
    }
    return waitTime;
}
