// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';

import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';


// Parse command-line arguments to extract the methodName and additional parameters

const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"


const main = async () => {
    try {
        let userInfo = loadOrGenerateUserInfo();
        userInfo = verifyUserInfoHasAccount(userInfo);
        // params = argv
        // validation
        console.log("Logging balance for user before starting")
        let balance = verifyBalance("X", userInfo["X"])
        console.log("X Balance:", balance)
        balance = verifyBalance("C", userInfo["C"])
        console.log("C Balance:", balance)
        balance = verifyBalance("P", userInfo["P"])
        console.log("P Balance:", balance)
    } catch (error) {
        console.error('Error occurred:', error.message);
        // Continue with your error handling logic, if needed
    }
};


main()




