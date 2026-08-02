import {
  insertFolderIntoDb,
  getAllFolderFromDb,
  getAllFileFromDb,
} from "../models/script.js";

export async function homePage(req, res) {
  const folderList = await getAllFolderFromDb();
  const fileList = await getAllFileFromDb();
  res.render("index", {
    folderListSize: folderList.length,
    folderList,
    fileList,
  });
}
