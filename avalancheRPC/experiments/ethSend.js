// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';

import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';


// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"

// Initialize default values
let methodName = 'eth.signTransaction';
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
        const bl = await verifyBalance("c", userInfo["C"])

        if (Number(bl.result.balance) > 0) {
            console.log("Balance:", bl)
            let result;
            for (let i = 0; i < iterations; i++) {
                // Create Transaction
                params = createTransaction(userInfo)
                // Sign the transaction
                methodName = "eth_signTransaction"
                result = await requestProcessor(methodName, params, i);
                console.log("eth_sign, result: ", result)
                // Send the transaction
                params = sendTransactionParams(result, userInfo)
                methodName = "eth_sendTransaction"
                console.log("Params", params)
                // issue tx
                // Call the function
                result = await requestProcessor(methodName, params, i);
                console.log("eth_send, result: ", result)

                console.log(i, ": results:", result)
                // Delay for 100ms before the next invocation
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        } else {
            console.error("Balance is wrong", bl)
        }

    } catch (error) {
        console.error('Error occurred:', error.message);
        // Continue with your error handling logic, if needed
    }
};

/*
// Request
curl -X POST --data '{"id": 1,"jsonrpc": "2.0","method": "eth_signTransaction","params":
 [
    {"data":"0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
    "from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
    "gas": "0x76c0",
    "gasPrice":     "0x9184e72a000",
    "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
    "value": "0x9184e72a"}]}'
// Result
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": "0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b"
}

*/
const createTransaction = (userInfo) => {
    let params = {
        "to": setupKeys[1].c,
        "from": [userInfo["C"]],
        "value": 1,
        "username": userInfo.account.accountName,
        "password": userInfo.account.pwd
    }
    return [params]
}

/*
 [
  {
    from: "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
    to: "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
    gas: "0x76c0", // 30400
    gasPrice: "0x9184e72a000", // 10000000000000
    value: "0x9184e72a", // 2441406250
    data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
  },

]
*/
const sendTransactionParams = (rst, userInfo) => {
    let params = {
        "to": setupKeys[1].c,
        "from": [userInfo["C"]],
        "value": 1,
        "username": userInfo.account.accountName,
        "password": userInfo.account.pwd,
        "data": rst.result
    }
    return [params]
}

main()




