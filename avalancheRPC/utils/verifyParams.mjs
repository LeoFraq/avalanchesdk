// Function to verify the number of parameters based on the method name
export function verifyParams(methodName, providedParams) {
    // Define the expected parameter structures for each method

    const methodParamStructures = {
        'avm.send': {
            assetID: '',
            amount: 0,
            to: '',
            from: [],
            changeAddr: '',
            memo: '',
            username: '',
            password: '',
        },
        'avm.getTx': {
            txID: '',
            encoding: '',
        },
        'avm.issueTx': {
            tx: '',
        },
        'platform.getBalance': {
            addresses: [],
        },
        'eth_getBalance': {
            address: '',
            block: '',
        },
        'eth_sendTransaction': {
            from: '',
            to: '',
            value: '',
        },
        'avm.importKey': {
            username: '',
            password: '',
            privateKey: '',
        },
        'avm.getAllBalances': {
            address: '',
        },
        // Add more method names and their expected parameter structures here
    };

    const expectedParamStructure = methodParamStructures[methodName];

    if (!expectedParamStructure) {
        throw new Error(`Invalid method name: ${methodName}`);
    }

    const providedParamCount = Object.keys(providedParams).length;
    const expectedParamCount = Object.keys(expectedParamStructure).length;

    if (providedParamCount !== expectedParamCount) {
        throw new Error(`Method ${methodName} expects ${expectedParamCount} parameters, received ${providedParamCount}`);
    }

    // Optionally, you can further validate the structure of providedParams
    // based on the expectedParamStructure here.

    return expectedParamStructure;
}

// Example usage:
// try {
//     const methodName = 'avm.send';
//     const providedParams = [
//         "AVAX",
//         6969,
//         "X-local1ur873jhz9qnaqv5qthk5sn3e8nj3e0kmggalnu",
//         ["X-local1g65uqn6t77p656w64023nh8nd9updzmxyymev2"],
//         "X-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u",
//         "hi, mom!",
//         "myUsername",
//         "FuckyourMom@12!"
//     ];

//     const expectedParamStructure = verifyMethodParams(methodName, providedParams);

//     console.log('Parameters are valid.');
//     console.log('Expected parameter structure:', expectedParamStructure);

//     // Continue with your logic here if the parameters are valid
// } catch (error) {
//     console.error('Error:', error.message);
// }

// Function to process parameters based on the expected parameter structure
export function processMethodParams(methodName, providedParams) {
    let expectedParamStructure = verifyParams(methodName, providedParams)
    const processedParams = {};

    Object.keys(expectedParamStructure).forEach((paramKey, index) => {
        const paramValue = providedParams[index];
        processedParams[paramKey] = paramValue;
    });

    return processedParams;
}

