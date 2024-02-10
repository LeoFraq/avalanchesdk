// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';

import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';
import fs from "fs"

// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"

// Initialize default values
let methodName = 'avm.sendMultiple';
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
        const bl = await verifyBalance("x", userInfo["x"])
        if (Number(bl.result.balance) > 0) {
            let waitTime = 250
            console.log("Balance:", bl)
            // issue tx
            for (let i = 0; i < iterations; i++) {

                params = buildParams(userInfo)

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


function buildParams(userInfo) {
    let outputs = []
    let currentSetupKeys = setupKeys
    if (fs.existsSync("accounts.json")) {
        try {
            const walletsJson = fs.readFileSync('accounts.json', 'utf8');
            currentSetupKeys = JSON.parse(walletsJson);
        } catch (error) {
            console.error('Error reading "accounts.json":', error.message);
            process.exit(1);
        }
    }
    currentSetupKeys.forEach(element => {
        outputs.push(
            {
                "assetID": assetID,
                "amount": 1000,
                "to": element.x
            }
        )
    });
    let params = {
        "outputs": outputs,
        "from": [userInfo["x"]],
        "changeAddr": userInfo["x"],
        "memo": "hi, mom!",
        "username": userInfo.account.accountName,
        "password": userInfo.account.pwd
    }
    return params
}


