import {
    Contract,
    ContractFactory
} from "ethers"
import { ethers } from "hardhat"
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';
import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';
import path from 'path';
import fs from "fs";


let contractName = 'Coin';
let contractAddr = ""
let iterations = 1

function parseCommandLineArgs() {
    if (process.argv[3]) {
        contractName = process.argv[2];
        iterations = process.argv[3];
        readSmartContractsData()
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


const main = async () => {
    parseCommandLineArgs();
    const userInfo = await verifyUserInfoHasAccount(userInfo);
    const Contract = await ethers.getContractFactory(contractName);
    const contract = await Contract.attach(contractAddr);
    let result = await contract.transfer(userInfo.c, 1000)
    console.log("Transfer contract result: ", result)
    let mint = await confirm.mint(userInfo.c, 10, iterations)
    console.log("Coin mint contract result: ", mint)
}



main()