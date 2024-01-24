// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';

import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';
import path from 'path';
import fs from "fs";

import { Web3 } from "web3" // repl  const { Web3 } = await import("web3");
// const web3 = new Web3("ws://localhost:9650/ext/bc/C/ws")
// // const web3 = new Web3("http://localhost:9650/ext/bc/C/rpc")
// web3.eth.personal.unlockAccount("0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC", "SpamTankFoalUnit@12!", 1200)

// internal - personal

let time = 60 // Seconds
let tps = 1

// Function to parse command-line arguments
function parseCommandLineArgs() {

    time = process.argv[2];
    tps = process.argv[3];
}

// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"
const web3 = new Web3("http://localhost:9650/ext/bc/C/rpc")

// curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'  -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/rpc

const main = async () => {
    // console.log("Web3", web3)
    // const txcount = await web3.eth.getTransactionCount('0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC')
    parseCommandLineArgs()
    let userInfo = await loadOrGenerateUserInfo()
    // This currently only works with this known raw address for the faucet
    // await unlockAccount("56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027", userInfo.c, userInfo.account.pwd)
    const intervalId = setInterval(async () => {
        generateTransfer(userInfo)
    }, 1000) // Execute loo every second
    // End experiment
    setTimeout(() => {
        clearInterval(intervalId);
        console.log(`Loop stopped after ${time} seconds.`);
    }, time * 1000);
    // // Check accounts on node
    // web3.eth.getAccounts()
    //     .then(console.log);
}

//  addr for primary faucet - 0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC - requires (de?)encoded pkey
const unlockAccount = async (pkey, caddr, pwd) => {
    try {
        await web3.eth.personal.importRawKey(pkey, pwd)
        // Wait for change to propagate
        await new Promise(resolve => setTimeout(resolve, 2000));
        await web3.eth.personal.unlockAccount(caddr, pwd, 30000000)
    }
    catch (error) {
        if (error instanceof Error && error.message.includes('account already exists')) {
            return; // Return without logging the error
        }
        console.error("Issue while unlocking account, ", error)
    }
}


const generateTransfer = async (userInfo) => {
    try {
        let tx = { from: userInfo.c, to: userInfo.c, value: web3.utils.toWei(0.05, "ether") }
        let result;
        let startTime = performance.now();
        let endTime
        let duration
        for (let index = 0; index < tps; index++) {
            startTime = performance.now();
            result = await web3.eth.sendTransaction(tx)
            endTime = performance.now();
            duration = endTime - startTime;
            console.log("Tx result:", result)
            const data = {
                Method: "eth.send_Transaction",
                Result: result,
                Duration_ms: duration
            };
            // Write the data to the log file in CSV format
            writeToCSVFile(`logs/eth.send_Transaction.csv`, data);
        }
    } catch (error) {
        console.error("Web3 error:", error)
        writeToCSVFile(`logs/exceptions/eth.send_Transaction.csv`, error);
    }
}


// Function to write data to a CSV file
function writeToCSVFile(fileName, data) {
    // Extract the directory path from the fileName
    const directory = path.dirname(fileName);
    // Create the directory (and its parent directories) if they don't exist
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    // Format the data as a CSV string
    const csvContent = Object.values(data).join('|') + '\n';
    // Append the CSV content to the file
    fs.appendFileSync(fileName, csvContent);
}

main()


// install
// npx hardhat compile -- Fix contracts
// npx hardhat run scripts/deploy/ts --network local
/*
    - name: Run the hardhat command and extract the contract address
      shell: npx hardhat run scripts/deploy.ts --show-stack-traces --network local | grep 'Coin deployed to:' | awk -F': ' '{print $2}'
      register: contract_address_output

    - name: Set the contract address as an Ansible variable
      set_fact:
        contract_address: "{{ contract_address_output.stdout | replace('\n', '') }}"

    - debug:
        msg: "Contract Address: {{ contract_address }}"

- Edit deploy script for each contract
- Create An Ethers deploy for each contract
- Adapt sol contracts
*/
