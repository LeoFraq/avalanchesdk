
import { requestProcessor } from './requestProcessor.mjs';

export async function verifyBalance(type, addr) {

    switch (type) {
        case "x":
            return await verifyX(addr)
            break;
        case "c":
            return verifyC(addr)
            break;
        case "p":
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
// AVAX balance is retrieved with getBalance, all others with getAssetBalance
async function verifyC(addr) {
    const method = "eth_getBalance"
    const params =
        [addr, "latest"]
    const result = await requestProcessor(method, params);
    // const hexBalance = "0xYourHexBalanceHere"; // Replace with the hex balance from the JSON-RPC response
    // const decimalBalance = parseInt(hexBalance, 16); // Convert hex to decimal

    return result
}

/*
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"eth_getBalance",
    "params" : ["0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC","latest"]
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/C/rpc

*/
