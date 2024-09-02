import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

const deleteOnCloudinary = async (filePath) => {
    try {
        if (!filePath ) return null

        const response = await cloudinary.uploader.destroy( filePath, {
            resource_type: "image"
        })

        return response;

    } catch (error) {
        throw error.message
    }
}
export {deleteOnCloudinary}