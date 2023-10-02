import axios from "axios"

const IP = '127.0.0.1'; // Replace with your server's IP address
const PORT = 9650; // Replace with your server's port
const id = 1;
const contentType = 'application/json';

// Define the base URL for your JSON-RPC endpoint

// Function to send a JSON-RPC request
export async function sendJsonRpcRequest(method, params, endpoint) {
    const baseURL = `http://${IP}:${PORT}/${endpoint}`;

    try {
        const requestData = {
            jsonrpc: '2.0',
            id: id,
            method: method,
            params: params,
        };

        const response = await axios.post(baseURL, requestData, {
            headers: {
                'Content-Type': contentType,
            },
        });

        // Handle the response here
        console.log('Response:', response.data);
        return response;
    } catch (error) {
        // Handle errors here
        console.error('Error:', error.message);
        throw error
    }
}
