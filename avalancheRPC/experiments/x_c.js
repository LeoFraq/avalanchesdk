// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';

import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';


// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"

// Initialize default values
let methodName = 'avm.export';
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
        const bl = await verifyBalance("X", userInfo["X"])

        if (Number(bl.result.balance) > 0) {
            let result;
            let to
            // issue tx
            for (let i = 0; i < iterations; i++) {
                if (i % 2 == 0) {
                    to = setupKeys[i % 4]
                    params = setXExportParams(bl, userInfo, to)
                    methodName = 'avm.export';
                }// i is uneven
                else {
                    params = setCImportParams(bl, userInfo, to)
                    methodName = 'avax.import';
                }
                result = await requestProcessor(methodName, params);
                console.log(i, ": results:", result)
                await new Promise(resolve => setTimeout(resolve, 100));

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
    "params" :{
            "to":"C-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5",
            "amount": 10,
            "assetID": "AVAX",
            "from":["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
            "changeAddr":"X-avax1turszjwn05lflpewurw96rfrd3h6x8flgs5uf8",
            "username":"myUsername",
            "password":"myPassword"
        }
*/
const setXExportParams = (bl, userInfo, to) => {
    console.log("Balance:", bl)
    params = {
        "assetID": assetID,
        "amount": 1,
        "to": to,
        "from": [userInfo["X"]],
        "changeAddr": userInfo["X"],
        "memo": "hi, mom!",
        "username": userInfo.account.accountName,
        "password": userInfo.account.pwd
    }
    console.log("Params", params)
}


/*
   "params" :{
        "to":"0x4b879aff6b3d24352Ac1985c1F45BA4c3493A398",
        "sourceChain":"X",
        "username":"myUsername",
        "password":"myPassword"
    }
*/
const setCImportParams = (bl, userInfo, to) => {
    console.log("Balance:", bl)
    params = {
        "to": to,
        "sourceChain": "X",
        "username": userInfo.account.accountName,
        "password": userInfo.account.pwd
    }
    console.log("Params", params)
}


main()




