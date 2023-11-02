// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';



// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"

// Initialize default values
let methodName = 'health.health';
let params = {};
let iterations = 1

// Function to parse command-line arguments
function parseCommandLineArgs() {
    iterations = 1;
}


const main = async () => {
    try {
        let userInfo = loadOrGenerateUserInfo();
        userInfo = verifyUserInfoHasAccount(userInfo);
        parseCommandLineArgs();
        // params = argv
        if (!methodName) {
            throw new Error('Method name not provided or not found:'.concat(methodName));
        }
        params = {
        }
        console.log("Params", params)
        // issue tx
        let isHealthy = false
        let failureCounter = 0
        // Call the function
        while (!isHealthy) {
            const result = await requestProcessor(methodName, params);
            console.log("health results:", result)
            if (result.result.healthy == true) {
                isHealthy = true
            }
            // Wait 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
            console.log("Health failure check", failureCounter)
            failureCounter++
            if (failureCounter >= 120) {
                console.error("Health check failed for ", failureCounter * 5, " seconds, quitting")
                process.exit(1)
            }
        }
    } catch (error) {
        console.error('Error occurred:', error.message);
    }
};


main()




