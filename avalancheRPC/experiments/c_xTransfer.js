// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from './utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from './utils/loadOrGenerateUserInfo.mjs';

import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';


// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"

// Initialize default values
let params = {};
let iterations = 1

// Function to parse command-line arguments
function parseCommandLineArgs() {
    iterations = process.argv[2];
}


const main = async () => {
    try {
        let userInfo = loadOrGenerateUserInfo();
        userInfo = verifyUserInfoHasAccount(userInfo);
        parseCommandLineArgs();
        // params = argv

        // validation
        const balance = verifyBalance("C", userInfo.X)
        if (balance.result.balance > 0) {
            console.log("Balance:", balance)

            // issue tx
            for (let i = 0; i < iterations; i++) {
                let methodName = 'avax.export';
                params = {
                    "amount": 1,
                    "to": userInfo.X,
                    "username": userInfo.account.username,
                    "password": userInfo.account.password
                }
                console.log("Params", params)
                // Call the function
                let result = await requestProcessor(methodName, params);
                console.log(i, ": results:", result)
                // Delay for 100ms before the next invocation
                await new Promise(resolve => setTimeout(resolve, 250));
                methodName = "avm.import"
                params = {
                    "to": userInfo.X,
                    "sourceChain": "C",
                    "username": userInfo.account.username,
                    "password": userInfo.account.password
                }
                console.log("Params", params)
                // Call the function
                result = await requestProcessor(methodName, params);
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




