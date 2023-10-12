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
    iterations = 1
}


const main = async () => {
    try {

        parseCommandLineArgs();
        // params = argv
        if (!methodName) {
            throw new Error('Method name not provided or not found:'.concat(methodName));
        }
        // validation
        params = {}
        methodName = "avm.getHeight"
        // Height
        iterations = await requestProcessor(methodName, params).height;

        methodName = "avm.getBlockByHeight"
        // issue tx
        for (let i = 0; i < iterations; i++) {
            params = {
                "height": String(i),
                "encoding": "json"
            },
                // Call the function
                result = await requestProcessor(methodName, params);
            console.log(i, ": results:", result, " \n")
            // Delay for 100ms before the next invocation
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    } catch (error) {
        console.error('Error occurred:', error.message);
        // Continue with your error handling logic, if needed
    }
};


main()




