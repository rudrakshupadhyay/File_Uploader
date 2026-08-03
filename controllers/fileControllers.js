import upload from "../utils/uploadConfig.js";
import {
  insertFileIntoDb,
  findFolderById,
  deleteFileById,
  findFileById,
} from "../models/script.js";
import fs from "node:fs/promises";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getCloudinaryDownloadUrl,
} from "../utils/cloudinary.js";

export function uploadFile(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (err) {
      const errors = err.message;
      return res.status(400).render("filesPage", {
        folderId: req.params.id,
        fileListSize: 0,
        user: req.user,
        errors,
      });
    }

    next();
  });
}

export async function openFolderController(req, res) {
  try {
    const folder = await findFolderById(req.params.id);
    res.render("filesPage", {
      fileList: folder.files,
      errors: null,
      fileListSize: folder.files.length,
      user: req.user,
      folderId: req.params.id,
    });
  } catch (error) {
    console.error("Error fetching folder:", error);
    res.status(500).render("filesPage", {
      errors: "Error fetching folder.",
      fileListSize: 0,
      user: req.user,
      folderId: req.params.id,
      fileList: [],
    });
  }
}

export async function uploadFileController(req, res) {
  try {
    const folder = await findFolderById(req.params.id);

    if (!folder) {
      return res.status(404).send("Folder not found");
    }

    if (!req.file) {
      return res.status(400).render("filesPage", {
        folderId: folder.id,
        fileListSize: folder.files.length,
        user: req.user,
        errors: "No file uploaded.",
        fileList: folder.files,
      });
    }
    const original_name = req.file.originalname;
    const mime_type = req.file.mimetype;
    const cloudinaryResult = await uploadToCloudinary(
      req.file.path,
      `DriveBox`,
    );

    const fileData = await insertFileIntoDb({
      original_name,
      size: cloudinaryResult.bytes,
      createdAt: new Date(),
      updatedAt: new Date(),
      folder_id: folder.id,
      user_id: req.user.id,
      cloud_url: cloudinaryResult.secure_url,
      public_id: cloudinaryResult.public_id,
      format: cloudinaryResult.format,
      mime_type,
      resource_type: cloudinaryResult.resource_type,
    });
    return res.redirect(`/folder/${folder.id}`);
  } catch (error) {
    console.error("Upload failed:", error);
    return res.status(500).render("filesPage", {
      folderId: req.params.id,
      fileList: [],
      fileListSize: 0,
      user: req.user,
      errors: "Error uploading file.",
    });
  }
}

export async function deleteFileController(req, res) {
  try {
    const { fileId } = req.params;
    const file = await findFileById(fileId);
    if (!file) {
      return res.status(404).send("File not found");
    }
    const path = file.file_path;
    await deleteFromCloudinary(file.public_id, file.resource_type);
    await deleteFileById(fileId);
    res.redirect(`/folder/${file.folder_id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render("filesPage", {
      folderId: req.params.id,
      fileList: [],
      fileListSize: 0,
      user: req.user,
      errors: "Error deleting file.",
    });
  }
}

export async function downloadFileController(req, res) {
  try {
    const { fileId } = req.params;
    const file = await findFileById(fileId);
    const downloadUrl = getCloudinaryDownloadUrl(
      file.public_id,
      file.resource_type,
      file.format,
    );
    res.redirect(downloadUrl);
  } catch (error) {
    console.error(error);
    res.status(500).render("filesPage", {
      folderId: req.params.id,
      fileList: [],
      fileListSize: 0,
      user: req.user,
      errors: "Error downloading file.",
    });
  }
}

export async function viewFileController(req, res) {
  try {
    const { fileId } = req.params;
    const file = await findFileById(fileId);
    if (!file) {
      return res.status(404).send("File not found");
    }
    res.render("viewFilePage", {
      file,
      folderId: req.params.id,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("filesPage", {
      folderId: req.params.id,
      fileList: [],
      fileListSize: 0,
      user: req.user,
      errors: "Error viewing file.",
    });
  }
}
