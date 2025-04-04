const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


async function uploadOnCloudinary(localFilePath) {
    if(!localFilePath) return null;
    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        return uploadResult;

    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        console.log(error);
    }
}

module.exports = {
    uploadOnCloudinary,
};