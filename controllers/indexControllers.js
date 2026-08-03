import {
  insertFolderIntoDb,
  findFolderById,
  updateFolderInDb,
  deleteFolderById,
} from "../models/script.js";

export async function homePage(req, res) {
  const folderList = req.user.folders;
  res.render("index", {
    user: req.user,
    folderListSize: folderList.length,
    folderList,
  });
}

export async function addFolder(req, res) {
  const name = req.body.name;
  const user_id = req.user.id;
  const data = { name, user_id };
  await insertFolderIntoDb(data);
  res.redirect("/");
}

export async function renameFolder(req, res) {
  const folderId = req.params.id;
  const folder = await findFolderById(folderId);
  if (!folder) {
    return res.status(404).send("Folder not found");
  }
  res.render("createFolder", { isEditing: true, folder });
}

export async function updateFolder(req, res) {
  const folderId = req.params.id;
  const newName = req.body.name;
  const updatedFolder = await updateFolderInDb(folderId, newName);
  res.redirect("/");
}

export async function deleteFolder(req, res) {
  const folderId = req.params.id;
  await deleteFolderById(folderId);
  res.redirect("/");
}
