import axios from "axios"
import fs from "fs";



let IP = '127.0.0.1'; // Replace with your server's IP address
let PORT = 9650; // Replace with your server's port
const id = 1;
const contentType = 'application/json';

// Define the base URL for your JSON-RPC endpoint
// "curl -X POST --data '{ "jsonrpc":"2.0", "id" :1, "method" :"health.health"}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/health"
// Function to send a JSON-RPC request
export async function sendJsonRpcRequest(method, params, endpoint, local) {
    let validIP = readAvailableIPs()
    validIP.push(IP + ":" + PORT)

    // Choose a random IP from the validIPs array
    const randomIP = validIP[Math.floor(Math.random() * validIP.length)];
    let baseURL = `http://${randomIP}/${endpoint}`;
    if (local) {
        baseURL = `http://${IP}:${PORT}/${endpoint}`;
    }
    const requestData = {
        jsonrpc: '2.0',
        id: id,
        method: method,
        params: params,
    };

    try {

        const response = await axios.post(baseURL, requestData, {
            headers: {
                'Content-Type': contentType,
            },
        });

        // Handle the response here
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error(baseURL, 'Error:', error.message, "With requestData:\n", requestData);
        throw error
    }
}


const readAvailableIPs = () => {
    try {
        const data = fs.readFileSync('IP.json', 'utf8');
        const jsonData = JSON.parse(data);
        const bootstrapIps = jsonData['bootstrap-ips'];

        // Split the string into an array of IP:Port values
        const ipsArray = bootstrapIps.split(',');

        // Do something with the array of IPs, for example, log them
        console.log('Available IPs:');
        ipsArray.forEach(ip => {
            console.log(ip);
        });

        return ipsArray;
    } catch (error) {
        console.error('Error reading IPs from IP.json:', error.message);
        throw error;
    }
}
