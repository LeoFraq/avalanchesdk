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
        const bl = await verifyBalance("x", userInfo["x"])

        if (Number(bl.result.balance) > 0) {
            let result;
            /*
            The avalanche documentation does not highlight this, but to export from the X chain, we want the cb58 address of our target,
            but to import, we want the EVM equivalent of the target
            */
            let to
            let toccb
            // const walletsJson = fs.readFileSync('accounts.json', 'utf8');
            // console.log("Loaded setup keys")
            // currentSetupKeys = JSON.parse(walletsJson);
            // issue tx
            for (let i = 0; i < iterations * 2; i++) {
                if (i % 2 == 0) {
                    to = userInfo.c
                    toccb = userInfo.ccb
                    params = setXExportParams(bl, userInfo, toccb)
                    methodName = 'avm.export';
                    await new Promise(resolve => setTimeout(resolve, 250));
                }// i is uneven
                else {
                    params = setCImportParams(bl, userInfo, to)
                    methodName = 'avax.import';
                }
                console.log("Sending request ", methodName, "with params", params)
                result = await requestProcessor(methodName, params);
                console.log(i, ": results:", result)
                await new Promise(resolve => setTimeout(resolve, 250));

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
// 1,000,000,000 GWEI = 1AVAX
const setXExportParams = (bl, userInfo, to) => {
    // console.log("Balance:", bl)
    params = {
        "assetID": "AVAX",
        "amount": 100000000000000,
        "baseFee": 1,
        "to": to,
        "from": [userInfo["x"]],
        "changeAddr": userInfo["x"],
        "memo": "hi, mom!",
        "username": userInfo.account.accountName,
        "password": userInfo.account.pwd
    }
    return params
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
    // console.log("Balance:", bl)
    params = {
        "to": to,
        "sourceChain": "X",
        "baseFee": 1,
        "username": userInfo.account.accountName,
        "password": userInfo.account.pwd
    }
    console.log("Params", params)
    return params
}


main()





// curl - X POST--data '{
// "jsonrpc": "2.0",
//     "id"     : 1,
//         "method" : "avm.export",
//             "params" : {
//     "to": "C-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u",
//         "amount": 100000000000000,
//             "assetID": "AVAX",
//                 "from": ["X-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"],
//                     "changeAddr": "X-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u",
//                         "username": "myUsernamesr9mm",
//                             "password": "SpamTankFoalUnit@12!"
// }
// }' -H 'content - type: application / json; ' 127.0.0.1:9650/ext/bc/X



// curl - X POST--data '{
// "jsonrpc": "2.0",
//     "id"     : 1,
//         "method" : "avax.importAVAX",
//             "params" : {
//     "to": "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC",
//         "sourceChain": "X",
//             "username": "myUsernamesr9mm",
//                 "password": "SpamTankFoalUnit@12!"
// }
// }' -H 'content - type: application / json; ' 127.0.0.1:9650/ext/bc/C/avax