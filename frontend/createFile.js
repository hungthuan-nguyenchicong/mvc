// createFile.js
const fs = require('fs'); // Import module 'fs'

const fileName = 'info.php';
const fileContent = `<?php

// This is a simple PHP info file

echo "<h1>Hello from Node.js created PHP file!</h1>";
echo "<p>Current date and time: " . date("Y-m-d H:i:s") . "</p>";

// You can add more PHP code here, e.g., phpinfo();
// phpinfo(); // Uncomment this line to display full PHP info

?>`;

fs.writeFile(fileName, fileContent, (err) => {
    if (err) {
        console.error('Lỗi khi tạo file:', err);
        return;
    } else {
        console.log(`File ${fileName} đã được tạo thành công!`)

    }
});