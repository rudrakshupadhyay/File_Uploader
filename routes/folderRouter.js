import { Router } from "express";
import {
  uploadFile,
  uploadFileController,
  openFolderController
} from "../controllers/fileControllers.js";

const router = Router();

router.get("/:id", openFolderController);

router.post("/:id/upload", uploadFile, uploadFileController);
export default router;
