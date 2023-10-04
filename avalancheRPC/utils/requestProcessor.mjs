// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { sendJsonRpcRequest } from './sendJsonRpcRequest.mjs';
import fs from "fs"
import path from 'path';

// Define the method name and parameters
// const methodName = 'health'; // Replace with the desired method name
// const params = {
//     // Replace with method-specific parameters if needed
// };

// Function to write to a log file
function writeToLogFile(fileName, content) {
    // Extract the directory path from the fileName
    const directory = path.dirname(fileName);

    // Create the directory (and its parent directories) if they don't exist
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    // Append the content to the file
    fs.appendFileSync(fileName, content + '\n');
}

// Measure the time before sending the request

export async function requestProcessor(methodName, params) {
    const startTime = performance.now();
    try {
        const result = await sendJsonRpcRequest(methodName, params);

        // Measure the time after the request completes
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Write the result and duration to the log file
        const logContent = `Method: ${methodName}\nResult: ${JSON.stringify(result)}\nDuration (ms): ${duration}`;
        writeToLogFile(`${methodName}.log`, logContent);

        console.log('Success:', result);
        // Continue with your logic here using the 'result'
    } catch (error) {
        // Measure the time after the request completes (even in failure)
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Write the exception and duration to the log file
        const logContent = `Method: ${methodName}\nError: ${error.message}\nDuration (ms): ${duration}`;
        writeToLogFile(`logs/exceptions/${methodName}.log`, logContent);

        // Handle errors here
        // Even though an error occurred, execution can continue
        console.error('Error occurred:', error.message);
        // Continue with your logic here, if needed
    }
};