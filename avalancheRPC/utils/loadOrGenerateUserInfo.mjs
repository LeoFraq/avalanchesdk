import fs from "fs"
import { requestProcessor } from "./requestProcessor.mjs";

export function loadOrGenerateUserInfo() {
    const filePath = 'userInfo.json'; // Replace with the actual file path
    let user_info;
    try {
        // Use fs.existsSync to check if the file exists synchronously
        if (fs.existsSync(filePath)) {
            // If the file exists, load its contents
            const fileContent = fs.readFileSync(filePath, 'utf8');
            user_info = JSON.parse(fileContent);
            console.log('Loaded userInfo.json:', user_info);
            return user_info
        } else {
            // If the file does not exist, generate and save it
            user_info = {
                privKey: "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN",
                x: "X-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u",
                p: "P-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u",
                ccb: "C-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u",
                c: "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC"
            }
            fs.writeFileSync(filePath, JSON.stringify(user_info, null, 2));
            console.log('Generated and saved userInfo.json:', user_info);
            return user_info
        }
    } catch (error) {
        console.error('Error checking/loading/generating userInfo.json:', error.message);
    }
}

export function updateUserInfo(newUserInfo) {
    let user_info = loadOrGenerateUserInfo()
    if (user_info) {
        // Update the user_info object
        Object.assign(user_info, newUserInfo);

        const filePath = 'userInfo.json'; // Replace with the actual file path
        try {
            // Write the updated user_info object back to the file
            fs.writeFileSync(filePath, JSON.stringify(user_info, null, 2));
            console.log('Updated userInfo.json:', user_info);
        } catch (error) {
            console.error('Error updating userInfo.json:', error.message);
        }
    } else {
        console.error('User info has not been loaded yet.');
    }
}



export async function verifyUserInfoHasAccount(userInfo) {
    if ('account' in userInfo && 'platformImport' in userInfo && 'avmImport' in userInfo) {
        console.log("userInfo has an account already");
    } else {
        console.warn('No account associated, creating one:');
        const accountName = "myUsernamesr9mm"
        const pwd = "SpamTankFoalUnit@12!";

        createAccount(userInfo, accountName, pwd);
        importAvmKey(userInfo, accountName, pwd);
        importPlatformKey(userInfo, accountName, pwd);
        importAvaxKey(userInfo, accountName, pwd);


    }
    return userInfo;
}

async function importPlatformKey(userInfo, accountName, pwd) {
    const input = { "username": accountName, "password": pwd, "privateKey": userInfo.privKey };
    const method = "platform.importKey";
    try {
        const result = await requestProcessor(method, input);
        console.log("Result from importPlatformKey", result)
        if (result.result) {
            userInfo.platformImport = true
            updateUserInfo(userInfo);
        }
    } catch (error) {
        console.error("Failed to import account for private key:", userInfo.privKey);
    }
}
async function importAvmKey(userInfo, accountName, pwd) {
    const input = { "username": accountName, "password": pwd, "privateKey": userInfo.privKey };
    const method = "avm.importKey";
    try {
        const result = await requestProcessor(method, input);
        console.log("Result from importAvmKey", result)
        if (result.result) {
            userInfo.avmImport = true;
            updateUserInfo(userInfo);
        }
    } catch (error) {
        console.error("Failed to import account for private key:", userInfo.privKey);

    }
}
async function importAvaxKey(userInfo, accountName, pwd) {
    const input = { "username": accountName, "password": pwd, "privateKey": userInfo.privKey };
    const method = "avax.importKey";
    try {
        const result = await requestProcessor(method, input);
        console.log("Result from importAvaxKey", result)
        if (result.result) {
            userInfo.avaxImport = true;
            updateUserInfo(userInfo);
        }
    } catch (error) {
        console.error("Failed to import account for private key:", userInfo.privKey);

    }
}

async function createAccount(userInfo, accountName, pwd) {
    const input = { "username": accountName, "password": pwd, "privateKey": userInfo.privKey };
    const method = "keystore.createUser";
    try {
        await requestProcessor(method, input);
        userInfo.account = { accountName, pwd };
        updateUserInfo(userInfo);
    } catch (error) {
        console.error("Failed to create account");

    }
}
