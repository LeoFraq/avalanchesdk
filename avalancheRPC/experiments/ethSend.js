// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';

import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';


// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"

// Initialize default values
let methodName = 'eth.signTransaction';
let params = {};
let iterations = 1

// Function to parse command-line arguments
function parseCommandLineArgs() {
    iterations = process.argv[2];
}


const main = async () => {
    try {
        let userInfo = await loadOrGenerateUserInfo();
        userInfo = await verifyUserInfoHasAccount(userInfo);
        parseCommandLineArgs();
        // params = argv
        if (!methodName) {
            throw new Error('Method name not provided or not found:'.concat(methodName));
        }
        // validation
        const bl = await verifyBalance("C", userInfo["C"])

        if (Number(bl.result.balance) > 0) {
            console.log("Balance:", bl)
            let result;
            for (let i = 0; i < iterations; i++) {
                // Create Transaction
                params = createTransaction(userInfo)
                // Sign the transaction
                methodName = "eth_signTransaction"
                result = await requestProcessor(methodName, params, i);
                console.log("eth_sign, result: ", result)
                // Send the transaction
                params = sendTransactionParams(result, userInfo)
                methodName = "eth_sendTransaction"
                console.log("Params", params)
                // issue tx
                // Call the function
                result = await requestProcessor(methodName, params, i);
                console.log("eth_send, result: ", result)

                console.log(i, ": results:", result)
                // Delay for 100ms before the next invocation
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        } else {
            console.error("Balance is wrong", bl)
        }

    } catch (error) {
        console.error('Error occurred:', error.message);
        // Continue with your error handling logic, if needed
    }
};

/*
  params: [
    {
      to: '0x93442D566Bb672D185c1904a39554Bfec47F7718',
      from: '0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC',
      value: 1,
      username: 'myUsernamet5nsx',
      password: 'SpamTankFoalUnit@12!'
    }
  ]
*/
const createTransaction = (userInfo) => {
    let params = {
        "to": setupKeys[1].c,
        "from": [userInfo["C"]],
        "value": 1,
        "username": userInfo.account.accountName,
        "password": userInfo.account.pwd
    }
    return [params]
}

/*
 [
  {
    from: "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
    to: "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
    gas: "0x76c0", // 30400
    gasPrice: "0x9184e72a000", // 10000000000000
    value: "0x9184e72a", // 2441406250
    data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
  },

]
*/
const sendTransactionParams = (rst, userInfo) => {
    let params = {
        "to": setupKeys[1].c,
        "from": [userInfo["C"]],
        "value": 1,
        "username": userInfo.account.accountName,
        "password": userInfo.account.pwd,
        "data": rst.result
    }
    return [params]
}

main()






// transaction := generateSimpleTransfer(chainid, accounts[i], tipCap, feeCap, 1, 1)  -> unsigned TxId
// func generateSimpleTransfer(chainid *big.Int, reciever accounts.Account, tipCap *big.Int, feeCap *big.Int, nonce uint64, value int64) *types.Transaction {

// 	gasLimit := uint64(21000)
// 	v := new(big.Int).Mul(big.NewInt(value), big.NewInt(params.Ether))

// 	tx := types.NewTx(
// 		&types.DynamicFeeTx{
// 			ChainID:   chainid,
// 			Nonce:     nonce,
// 			GasTipCap: tipCap,
// 			GasFeeCap: feeCap,
// 			Gas:       gasLimit,
// 			To:        &reciever.Address,
// 			Value:     v,
// 			Data:      nil,
// 		})

// 	return tx
// }
// transaction = accountManager.SignTransaction(transaction, *masterAccount, chainid) -> Signed TxId
// SendTransactionToExecutionClient(masterClient, &t.TransactionEvalInfo{Transaction: transaction}, nil) -> Sends Tx to 