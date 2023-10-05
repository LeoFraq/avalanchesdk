
import { requestProcessor } from './requestProcessor.mjs';

export async function verifyBalance(type, addr) {

    switch (type) {
        case "X":
            return await verifyX(addr)
            break;
        case "C":
            return verifyC(addr)
            break;
        case "P":
            return verifyP(addr)
            break;
        default:
            console.error("Type not valid")
            break;
    }
}
// Assume
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"

async function verifyX(addr) {
    const method = "avm.getBalance"
    const params = {
        "address": addr,
        "assetID": assetID
    }
    const result = await requestProcessor(method, params);
    return result
}
async function verifyP(addr) {
    const method = "platform.getBalance"
    const params = {
        "addresses": [addr],
    }
    const result = await requestProcessor(method, params);
    return result
}
async function verifyC(addr) {
    const method = "eth_getAssetBalance"
    const params =
        [addr, "latest", assetID]
    const result = await requestProcessor(method, params);
    // const hexBalance = "0xYourHexBalanceHere"; // Replace with the hex balance from the JSON-RPC response
    // const decimalBalance = parseInt(hexBalance, 16); // Convert hex to decimal

    return result
}
