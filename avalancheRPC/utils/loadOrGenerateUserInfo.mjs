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
                X: "X-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u",
                P: "P-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u",
                C: "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC"
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
    if ('account' in userInfo) {
        console.log("userInfo has account already")
        return;
    } else {
        console.warn('No account associated, creating one:');
        //  random string
        let r = (Math.random() + 1).toString(36).substring(7);
        let accountName = "myUsername".concat(r)
        let pwd = "SpamTankFoalUnit@12!"
        // X
        let input = { "username": accountName, "password": pwd, "privateKey": userInfo.privKey }
        let method = "avm.importKey"
        try {
            await requestProcessor(method, input)
            userInfo.account = { accountName, pwd }

            updateUserInfo(userInfo)
        } catch (error) {
            console.error("Failed to import account for private key:", userInfo.privKey)
            throw error;
        }
        // C
        input = { "username": accountName, "password": pwd, "privateKey": userInfo.privKey }
        method = "avax.importKey"
        try {
            await requestProcessor(method, input)
            userInfo.account = { accountName, pwd }

            updateUserInfo(userInfo)
        } catch (error) {
            console.error("Failed to import account for private key:", userInfo.privKey)
            throw error;
        }
        // P
        input = { "username": accountName, "password": pwd, "privateKey": userInfo.privKey }
        method = "platform.importKey"
        try {
            await requestProcessor(method, input)
            userInfo.account = { accountName, pwd }

            updateUserInfo(userInfo)
        } catch (error) {
            console.error("Failed to import account for private key:", userInfo.privKey)
            throw error;
        }
        return userInfo;
    }
}
