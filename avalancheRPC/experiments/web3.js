// const sendJsonRpcRequest = require('./sendJsonRpcRequest');
import { requestProcessor } from '../utils/requestProcessor.mjs';
import { loadOrGenerateUserInfo, verifyUserInfoHasAccount } from '../utils/loadOrGenerateUserInfo.mjs';

import { setupKeys } from '../utils/knownAddresses.mjs';
import { verifyBalance } from '../utils/verifyBalance.mjs';
import { Web3 } from "web3"


// Parse command-line arguments to extract the methodName and additional parameters
const args = process.argv.slice(2);
const assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"

const web3 = new Web3("http://localhost:9650/ext/bc/C/rpc")
const main = async () => {
    console.log("Web3", web3)
    const txcount = await web3.eth.getTransactionCount('0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC')
    console.log(txcount)

    // Check accounts on node
    web3.eth.getAccounts()
        .then(console.log);
    // let txId = generateSimpleTransfer()
    // let signedTx = signTransaction(txId)

    // sendTx(signedTx)
}


// const generateSimpleTransfer = async () => {
//     const originalMessage = [
//         {
//             type: "string",
//             name: "fullName",
//             value: "Satoshi Nakamoto",
//         },
//         {
//             type: "uint32",
//             name: "userId",
//             value: "1212",
//         },
//     ];
//     const params = [originalMessage, fromAddress];
//     const method = "eth_signTypedData";
//     const signedMessage = await web3.currentProvider.sendAsync({
//         id: 1,
//         method,
//         params,
//         fromAddress,
//     });
//     return signedMessage
// }
// const signTransaction = async () => {
//     const receipt = await web3.eth.signTransaction({
//         from: fromAddress,
//         to: destination,
//         value: amount,
//         maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
//         maxFeePerGas: "6000000000000", // Max fee per gas
//     });
// }
// const sendTx = () => {
//     // Submit transaction to the blockchain and wait for it to be mined
//     const receipt = await web3.eth.sendTransaction({
//         from: fromAddress,
//         to: destination,
//         value: amount,
//         maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
//         maxFeePerGas: "6000000000000", // Max fee per gas
//     });
// }

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