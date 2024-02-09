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
let methodName = 'avm.send';
let params = {};

let time = 60 // Seconds
let tps = 1

// Function to parse command-line arguments
function parseCommandLineArgs() {
    time = process.argv[2];
    tps = process.argv[3];
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
        let currentSetupKeys = setupKeys
        if (fs.existsSync("accounts.json")) {
            try {
                const walletsJson = fs.readFileSync('accounts.json', 'utf8');
                console.log("Loaded setup keys")
                currentSetupKeys = JSON.parse(walletsJson);
                console.log(currentSetupKeys)

            } catch (error) {
                console.error('Error reading "accounts.json":', error.message);
                process.exit(1);
            }
        }
        let counter = 0;
        const bl = await verifyBalance("x", userInfo["x"])
        if (Number(bl.result.balance) > 0) {
            let currentAddr = userInfo
            // issue tx
            const intervalId = setInterval(async () => {
                for (let i = 0; i < tps; i++) {
                    const params = {
                        "assetID": assetID,
                        "amount": 1,
                        "to": currentSetupKeys[counter + 1 % currentSetupKeys.length],
                        "from": [currentAddr.x],
                        "changeAddr": currentAddr.x,
                        "memo": "hi, mom!",
                        "username": currentAddr.account.accountName,
                        "password": currentAddr.account.pwd
                    };
                    console.log("Logging parameters:", params);
                    currentAddr = currentSetupKeys[counter % currentSetupKeys.length];
                    // We loop through all existing addresses
                    counter++
                    // Call the function
                    const result = await requestProcessor(methodName, params);
                    console.log(i, ": results:", result, " \n");
                }
            }, 1000); // Execute the loop every second

            // Stop the loop after M seconds
            setTimeout(() => {
                clearInterval(intervalId);
                console.log(`Loop stopped after ${time} seconds.`);
            }, time * 1000);
        } else {
            console.error("Balance is wrong", bl)
        }

    } catch (error) {
        console.error('Error occurred:', error.message);
        // Continue with your error handling logic, if needed
    }
};


main()





