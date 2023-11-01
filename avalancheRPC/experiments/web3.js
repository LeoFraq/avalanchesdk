// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';

import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';
import { Web3 } from "web3" // repl  const { Web3 } = await import("web3");
// const web3 = new Web3("ws://localhost:9650/ext/bc/C/ws")
// // const web3 = new Web3("http://localhost:9650/ext/bc/C/rpc")
// web3.eth.personal.unlockAccount("0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC", "SpamTankFoalUnit@12!", 1200)

// internal - personal

let iterations = 1

// Function to parse command-line arguments
function parseCommandLineArgs() {
    iterations = process.argv[2];
}

// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"
const web3 = new Web3("http://localhost:9650/ext/bc/C/rpc")

const main = async () => {
    // console.log("Web3", web3)
    // const txcount = await web3.eth.getTransactionCount('0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC')
    parseCommandLineArgs()
    let userInfo = await loadOrGenerateUserInfo()
    // This currently only works with this known raw address for the faucet
    await unlockAccount("56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027", userInfo.c, userInfo.account.pwd)
    generateTransfer(iterations, userInfo)
    // // Check accounts on node
    // web3.eth.getAccounts()
    //     .then(console.log);
    // let txId = generateSimpleTransfer()
    // let signedTx = signTransaction(txId)

    // sendTx(signedTx)
}

// 56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027 for primary faucet - 0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC
const unlockAccount = async (pkey, caddr, pwd) => {
    await web3.eth.personal.importRawKey(pkey, pwd)
    // Wait for change to propagate
    await new Promise(resolve => setTimeout(resolve, 2000));
    await web3.personal.unlockAccount(caddr, pwd, 300000)
}

const generateTransfer = (iterations, userInfo) => {
    let tx = { from: userInfo.c, to: userInfo.c, value: web3.utils.toWei(0.05, "ether") }
    for (let index = 0; index < iterations; index++) {
        web3.eth.sendTransaction(tx)

    }
}