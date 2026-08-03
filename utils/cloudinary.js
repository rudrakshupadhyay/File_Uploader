import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath, folder) => {
  try {
    if (!filePath) {
      throw new Error("File path is required for Cloudinary upload.");
    }
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: folder,
    });
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  } finally {
    // Delete the local file after uploading to Cloudinary
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error("Error deleting local file:", err);
    }
  }
};

const deleteFromCloudinary = async (publicId, resource_type) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for Cloudinary deletion.");
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resource_type || "auto",
    });
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

const getCloudinaryDownloadUrl = (publicId, resourceType, format) => {
  if (!publicId) {
    throw new Error("Public ID is required.");
  }

  return  cloudinary.url(publicId, {
    resource_type: resourceType,
    format: format || null,
    flags: "attachment",
  });
};

export { uploadToCloudinary, deleteFromCloudinary, getCloudinaryDownloadUrl };
