const fs = require('fs');
const path = require('path');

const deleteFile = (file, folder) =>{
    const filePath =  path.join(__dirname, '../public/images', folder, file)
    try {
        fs.unlinkSync(filePath);
        console.log("deleted file");
    } catch (error) {
        console.log(error);
    }
}

module.exports = deleteFile;