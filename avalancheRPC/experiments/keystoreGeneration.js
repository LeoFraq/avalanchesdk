import fs from "fs"
import { requestProcessor } from '../utils/requestProcessor.mjs';


let iterations

function parseCommandLineArgs() {
    iterations = process.argv[2];
}

function saveAccountsToJson(accounts) {
    // Load existing accounts from the file if it exists, or initialize an empty array
    let existingAccounts = [];
    try {
        existingAccounts = JSON.parse(fs.readFileSync("accounts.json", "utf8"));
    } catch (error) {
        // Handle the case where the file doesn't exist or is empty
    }

    // Merge existing and new accounts and write them back to the file
    const updatedAccounts = [...existingAccounts, ...accounts];
    fs.writeFileSync("accounts.json", JSON.stringify(updatedAccounts, null, 2), "utf8");
}


const main = async () => {
    try {
        console.log("Starting keystore generation utility")
        parseCommandLineArgs()
        let user;
        let pwd;
        let chainData = {}
        const generatedAccounts = []; // Collect generated accounts
        for (let index = 0; index < iterations; index++) {
            user = generateRandomAccountName()
            pwd = generateRandomPassword()
            chainData = await createAccount(chainData, user, pwd)
            chainData = await createAddress(chainData)
            // Push the generated account into the array
            generatedAccounts.push(chainData);
            await new Promise(resolve => setTimeout(resolve, 250));

        }
        // Save the generated accounts to a JSON file
        saveAccountsToJson(generatedAccounts);

    }
    catch (error) { console.error(error) }
}


async function createAddress(userInfo) {
    const input = { "username": userInfo.account.accountName, "password": userInfo.account.pwd }
    const method = "platform.createAddress";
    let platformData = await requestProcessor(method, input)
    console.log("platformData", platformData)
    platformData = platformData.result.address
    userInfo = { ...userInfo, x: replacePrefixWithLetter(platformData, "X"), c: replacePrefixWithLetter(platformData, "C"), p: platformData }
    return userInfo
}

async function createAccount(userInfo, accountName, pwd) {
    const input = { "username": accountName, "password": pwd };
    const method = "keystore.createUser";
    try {
        await requestProcessor(method, input);
        userInfo.account = { accountName, pwd };
        return userInfo;
    } catch (error) {
        console.error("Failed to create account");
        throw error;
    }
}
function generateRandomAccountName() {
    const r = (Math.random() + 1).toString(36).substring(9);
    return "myUsername".concat(r);
}
function generateRandomPassword() {
    const r = (Math.random() + 1).toString(36).substring(9);
    return "SpamTankFoalUnit@12!".concat(r);
}

function replacePrefixWithLetter(inputString, letter) {
    // Check if the inputString starts with "P-"
    if (inputString.startsWith("P-")) {
        // Replace "P-" with the specified letter
        return letter + inputString.slice(1);
    }
    // If the inputString doesn't start with "P-", return it as is
    return inputString;
}

main()