export function loadOrGenerateUserInfo() {
    const filePath = 'userInfo.json'; // Replace with the actual file path
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
                X: 'foo',
                P: 'bar',
                C: 'baz',
            };
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

        const filePath = 'user_info.json'; // Replace with the actual file path
        try {
            // Write the updated user_info object back to the file
            fs.writeFileSync(filePath, JSON.stringify(user_info, null, 2));
            console.log('Updated user_info.json:', user_info);
        } catch (error) {
            console.error('Error updating user_info.json:', error.message);
        }
    } else {
        console.error('User info has not been loaded yet.');
    }
}
