import { sendJsonRpcRequest } from './sendJsonRpcRequest.mjs';
import fs from "fs";
import path from 'path';

// Define the method name and parameters
const methodName = 'health'; // Replace with the desired method name
const params = {
    // Replace with method-specific parameters if needed
};

// Function to write data to a CSV file
function writeToCSVFile(fileName, data) {
    // Extract the directory path from the fileName
    const directory = path.dirname(fileName);
    // Create the directory (and its parent directories) if they don't exist
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    // Format the data as a CSV string
    const csvContent = Object.values(data).join(',') + '\n';
    // Append the CSV content to the file
    fs.appendFileSync(fileName, csvContent);
}

// Measure the time before sending the request
export async function requestProcessor(methodName, params) {
    const startTime = performance.now();
    let endpoint = getEndpoint(methodName);

    try {
        const result = await sendJsonRpcRequest(methodName, params, endpoint);
        // Measure the time after the request completes
        const endTime = performance.now();
        const duration = endTime - startTime;
        // Create an object to hold the data you want to write to the CSV file
        const data = {
            Method: methodName,
            Result: JSON.stringify(result),
            Duration_ms: duration
        };
        // Write the data to the log file in CSV format
        writeToCSVFile(`logs/${methodName}.csv`, data);
        // console.log('Success:', result);
        return result;
        // Continue with your logic here using the 'result'
    } catch (error) {
        // Measure the time after the request completes (even in failure)
        const endTime = performance.now();
        const duration = endTime - startTime;
        // Create an object to hold the data for exceptions
        const data = {
            Method: methodName,
            Error: error.message,
            Duration_ms: duration
        };
        // Write the data for exceptions to the log file in CSV format
        writeToCSVFile(`logs/exceptions/${methodName}.csv`, data);

        // Handle errors here
        // Even though an error occurred, execution can continue
        console.error('Error occurred:', error.message);
        // Continue with your logic here, if needed
    }
};

function getEndpoint(methodName) {

    switch (methodName) {
        case 'platform.getBalance':
        case 'platform.importKey':
        case 'platform.importAVAX':
        case 'platform.createAddress':
            return 'ext/bc/P';
        case 'avm.send':
        case 'avm.sendMultiple':
        case 'avm.getTx':
        case 'avm.issueTx':
        case 'avm.importKey':
        case 'avm.getAllBalances':
        case 'avm.getBalance':
        case 'avm.export':
        case 'avm.getHeight':
        case 'avm.getBlockByHeight':
            return 'ext/bc/X';
        case 'evm':
        case 'eth_sendTransactions':
        case 'avax':
            return 'ext/bc/C'
        case 'eth_getAssetBalance':
        case 'eth_sendTransaction':
        case 'eth_signTransaction':
        case 'eth_getBalance':
        case 'avax.importKey':
            return 'ext/bc/C/rpc'
        case 'avax.importKey':
        case 'avax.import':
            return 'ext/bc/C/avax'
        case 'health.health':
            return 'ext/health'
        case 'info':
            return 'ext/info'
        case 'keystore.createUser':
            return 'ext/keystore'
        // Add more cases for other endpoints as needed
        default:
            return 'unknown method: '.concat(methodName); // Return a default value if the endpoint is not recognized
    }

}

