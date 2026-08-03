import { Router } from "express";
import {
  homePage,
  addFolder,
  renameFolder,
  updateFolder,
  deleteFolder,
} from "../controllers/indexControllers.js";
import folderRouter from "./folderRouter.js";
const router = Router();

router.get("/", homePage);

router.get("/createfolder", (req, res) => {
  res.render("createFolder", { isEditing: false });
});

router.post("/createfolder", addFolder);

router.get("/renamefolder/:id", renameFolder);
router.post("/renamefolder/:id", updateFolder);
router.delete("/deletefolder/:id", deleteFolder);
router.use("/folder", folderRouter);
export default router;
