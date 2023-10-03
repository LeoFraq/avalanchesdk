// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from './utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from './utils/loadOrGenerateUserInfo.mjs';
import { processMethodParams } from './utils/verifyParams.mjs';
import fs from "fs"
import yargs from 'yargs'

// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);

// Initialize default values
let methodName = '';
let params = [];
let data = {};
let iterations = 1

// Function to parse command-line arguments
function parseCommandLineArgs() {
    if (process.argv.length !== 5) {
        console.error('Usage: node script.js <method> <iterations> <JSONdata>');
        process.exit(1);
    }
    methodName = process.argv[2];
    iterations = process.argv[3];
    data = process.argv[4];

    try {
        params = JSON.parse(data);
    } catch (error) {
        console.error('Invalid JSON data:', error.message);
        process.exit(1);
    }
}




// function processParams(methodName, params) { }

const main = async () => {
    try {
        let userInfo = loadOrGenerateUserInfo();
        userInfo = verifyUserInfoHasAccount(userInfo);
        parseCommandLineArgs();
        // params = argv
        if (!methodName) {
            throw new Error('Method name not provided or not found:'.concat(methodName));
        }
        // validation
        processMethodParams(methodName, params)
        console.log("Params", params)
        // issue tx
        const result = await requestProcessor(methodName, params);
        console.log('Success:', result);
    } catch (error) {
        console.error('Error occurred:', error.message);
        // Continue with your error handling logic, if needed
    }
};


main()




