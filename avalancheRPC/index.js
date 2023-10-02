// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from './utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo } from './utils/loadOrGenerateUserInfo.mjs';
import fs from "fs"

// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);

// Initialize default values
let methodName = '';
const params = [];

// Function to parse command-line arguments
function parseCommandLineArgs() {
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--methodName' && i + 1 < args.length) {
            methodName = args[i + 1];
            i++; // Skip the next argument since it's already used
        } else {
            // Assuming additional parameters are passed in an orderly fashion
            params.push(args[i]);
        }
    }
}

main() = async () => {
    try {
        parseCommandLineArgs();
        let userInfo = loadOrGenerateUserInfo();
        if (!methodName) {
            throw new Error('Method name not provided.');
        }

        const result = await requestProcessor(methodName, params);
        console.log('Success:', result);
        // Continue with your logic here using the 'result'
    } catch (error) {
        console.error('Error occurred:', error.message);
        // Continue with your error handling logic, if needed
    }
};


main()