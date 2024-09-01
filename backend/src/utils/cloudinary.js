import {v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath ) return null

        // upload the file in cloudinary
        const response = await cloudinart.uploader.upload( filePath, {
            resource_type: "auto"
        })

        // file has uploaded successfully
        console.log("file is uploaded in cloudinary", response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(filePath) // remove the locally saved temp file as the upload operation got failed
        return null
    }
}
export {uploadOnCloudinary}