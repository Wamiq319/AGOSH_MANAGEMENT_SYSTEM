import { v2 as cloudinary } from "cloudinary";

let isCloudinaryConfigured = false;

const configureCloudinary = () => {
  if (!isCloudinaryConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    isCloudinaryConfigured = true;
  }
};

const uploadToCloudinary = async (file, folder = "agosh_management_system") => {
  try {
    configureCloudinary();

    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(error.message || "Cloudinary upload failed");
  }
};

export { uploadToCloudinary };
