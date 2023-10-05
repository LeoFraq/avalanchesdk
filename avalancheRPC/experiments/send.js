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
        const balance = verifyBalance("X", userInfo["X"])
        if (balance.result.balance > 0) {
            console.log("Balance:", balance)
            params = {
                "assetID": assetID,
                "amount": 1,
                "to": setupKeys[1].x,
                "from": [userInfo["X"]],
                "changeAddr": userInfo["X"],
                "memo": "hi, mom!",
                "username": userInfo.account.username,
                "password": userInfo.account.password
            }
            console.log("Params", params)
            // issue tx
            for (let i = 0; i < iterations; i++) {
                // Call the function
                const result = await requestProcessor(methodName, params);
                console.log(i, ": results:", result)
                // Delay for 100ms before the next invocation
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } else {
            console.error("Balance is wrong", balance)
        }

    } catch (error) {
        console.error('Error occurred:', error.message);
        // Continue with your error handling logic, if needed
    }
};


main()




