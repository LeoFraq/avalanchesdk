// import {
//     Contract,
//     ContractFactory
// } from "ethers"
// import { ethers } from "hardhat"
// import fs from "fs";

import {
    Contract,
    ContractFactory
} from "ethers"
import { ethers } from "hardhat"
const path = require('path')
const fs = require('fs');



let contractName = 'Youtube';
let contractAddr = ""
let iterations = 100

// function parseCommandLineArgs() {
//     if (process.argv[3]) {
//         contractName = process.argv[2];
//         iterations = process.argv[3];
//         readSmartContractsData()
//     }
// }

/*
Run details
- deploy respective contract XXXdeploy.ts
- make sure main account (faucet) is enabled on C-chain, see geth scripts
- run script
*/

const main = async () => {
    // parseCommandLineArgs();
    readSmartContractsData()
    const userInfo = readUserInfo()
    const Contract = await ethers.getContractFactory(contractName);
    const contract = await Contract.attach(contractAddr);
    // let result = await contract.transfer(userInfo.c, 1000)
    // console.log("Transfer contract result: ", result)
    for (let index = 0; index < iterations; index++) {
        let url = "url".concat(index.toString())
        let mint = await contract.upload(userInfo.c, url)
        console.log("Youtube upload contract result: ", mint)
        writeToCSVFile('logs/youtube.csv', mint)

    }

}
// Read data from smartContracts.json
function readSmartContractsData() {
    try {
        const data = fs.readFileSync('smartContracts.json');
        const contracts = JSON.parse(data);

        if (contracts[contractName]) {
            contractAddr = contracts[contractName];
            console.log(`Address for ${contractName}: ${contractAddr}`);
        } else {
            console.log(`Contract ${contractName} not found in smartContracts.json`);
        }
    } catch (err) {
        console.error('Error reading smartContracts.json:', err);
    }
}

function readUserInfo() {
    try {
        const data = fs.readFileSync('userInfo.json');
        const userInfo = JSON.parse(data);
        return userInfo
    } catch (err) {
        console.error('Error reading userInfo.json:', err);
    }
}


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