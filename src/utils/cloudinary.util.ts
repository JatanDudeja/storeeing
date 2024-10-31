import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath: string, filePathOnCloudinary?: string) => {
  try {
    if (!localFilePath) {
      return null;
    } else {

        const publicID = localFilePath.replace('public/temp', '')
      //upload the file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
        folder: filePathOnCloudinary,
        public_id: publicID,
        asset_id: publicID // uses this as the name of the image on cloudinary
      });
      // file has been uploaded successfully

      // remove image from server if file upload is successful
      fs.unlinkSync(localFilePath);
      return response;
    }
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the file stored on server if upload got failed on cloudinary
    return null;
  }
};

export { uploadOnCloudinary };