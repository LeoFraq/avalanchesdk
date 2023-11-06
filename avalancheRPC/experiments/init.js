// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';

import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';
import { Web3 } from "web3"

// Parse command-line arguments to extract the methodName and additional parameters

const args = process.argv.slice(2);
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"
const web3 = new Web3("http://localhost:9650/ext/bc/C/rpc")


const main = async () => {
    try {
        let userInfo = await loadOrGenerateUserInfo();
        userInfo = await verifyUserInfoHasAccount(userInfo);
        // params = argv
        // validation
        console.log("Logging balance for user before starting")
        let balance = await verifyBalance("x", userInfo["x"])
        console.log("X Balance:", balance)
        balance = await verifyBalance("c", userInfo["c"])
        console.log("C Balance:", balance)
        balance = await verifyBalance("p", userInfo["p"])
        console.log("P Balance:", balance)
        await unlockAccount("56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027", userInfo.c, userInfo.account.pwd)
        // Unlock faucet on the C chain
    } catch (error) {
        console.error('Error occurred:', error.message);
        // Continue with your error handling logic, if needed
    }
};

const unlockAccount = async (pkey, caddr, pwd) => {
    try {
        await web3.eth.personal.importRawKey(pkey, pwd)
        // Wait for change to propagate
        await new Promise(resolve => setTimeout(resolve, 2000));
        await web3.eth.personal.unlockAccount(caddr, pwd, 120000000)
    }
    catch (error) {
        if (error instanceof Error && error.message.includes('account already exists')) {
            return; // Return without logging the error
        }
        console.error("Issue while unlocking account, ", error)
    }
}


main()




