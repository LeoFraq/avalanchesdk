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
        // validation
        processPHeight()
        processXHeight()
        processCHeight()
    } catch (error) {
        console.error('Error occurred:', error.message);
        // Continue with your error handling logic, if needed
    }
};


main()



async function processXHeight() {
    // validation
    params = {}
    methodName = "avm.getHeight"
    // Height
    iterations = await requestProcessor(methodName, params);

    methodName = "avm.getBlockByHeight"
    let result
    // issue tx
    for (let i = 0; i < iterations.result.height; i++) {
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
}


async function processPHeight() {
    // validation
    params = {}
    methodName = "platform.getHeight"
    // Height
    iterations = await requestProcessor(methodName, params);

    methodName = "platform.getBlockByHeight"
    let result
    // issue tx
    for (let i = 0; i < iterations.result.height; i++) {
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
}

async function processCHeight() {
    // 
    params = ["latest", true]
    methodName = "eth_getBlockByNumber"
    // Height
    let result = await requestProcessor(methodName, params);
    console.log("ETH get block by number:", result)
    iterations = extractCHeight(result)

    for (let i = 0; i < iterations; i++) {
        params = [
            "0x" + i.toString(16), "true"
        ]
        // Call the function
        result = await requestProcessor(methodName, params);
        console.log(i, ": results:", result, " \n")
        // Delay for 100ms before the next invocation
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

function extractCHeight(jsonData) {
    try {
        // Parse the JSON string to a JavaScript object
        const jsonObject = JSON.parse(jsonData);

        // Access the "number" field from the JSON object and convert it to a decimal value
        const decimalNumber = parseInt(jsonObject.result.number, 16);

        return decimalNumber || 0;
    } catch (error) {
        console.error("Error: ", error);
        return 0;
    }
}






// curl -X POST --data '{
//     "jsonrpc":"2.0",
//     "id"     :1,
//     "method" :"eth_getBalance",
//     "params": ["0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC", "latest"]
// }' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/rpc