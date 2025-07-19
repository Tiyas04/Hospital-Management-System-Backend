import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_API_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {   
        if(!localFilePath){
            return null
        }else{
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type : 'auto'
            })
            console.log("File uploaded on cloudinary successfully")
            fs.unlinkSync(localFilePath)
            return response
        }
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

export default uploadOnCloudinary