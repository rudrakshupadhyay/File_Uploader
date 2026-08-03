import upload from "../utils/uploadConfig.js";
import {
  insertFileLocalIntoDb,
  findFolderById,
  deleteFileById,
  findFileById,
} from "../models/script.js";
import fs from "node:fs/promises";

export function uploadFile(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (err) {
      const errors = err.message;
      console.log(errors);
      console.log(Array.isArray(errors));
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

    await insertFileLocalIntoDb({
      original_name: req.file.originalname,
      stored_name: req.file.filename,
      file_type: req.file.mimetype,
      file_path: req.file.path,
      size: req.file.size,
      folder_id: folder.id,
      user_id: req.user.id,
    });

    return res.redirect(`/folder/${folder.id}`);
  } catch (error) {
    console.error(error);

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
    await fs.unlink(path);
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
    res.download(file.file_path, file.original_name);
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
