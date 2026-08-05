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

  // ✅ ADD THIS TRY/CATCH
  try {
    await insertFolderIntoDb({ name, user_id });
    res.redirect("/");
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma unique constraint error
      return res.status(400).send("A folder with this name already exists.");
    }
    console.error(error);
    res.status(500).send("Internal server error.");
  }
}

export async function renameFolder(req, res) {
  const folderId = req.params.id;
  const folder = await findFolderById(folderId);

  if (!folder || folder.user_id !== req.user.id) {
    return res.status(403).send("Forbidden: You do not own this folder.");
  }
  res.render("createFolder", { isEditing: true, folder });
}

export async function updateFolder(req, res) {
  const folderId = req.params.id;
  const newName = req.body.name;
  const folder = await findFolderById(folderId);
  
  if (!folder || folder.user_id !== req.user.id) {
    return res.status(403).send("Forbidden: You do not own this folder.");
  }

  try {
    await updateFolderInDb(folderId, newName);
    res.redirect("/");
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).send("A folder with this name already exists.");
    }
    console.error(error);
    res.status(500).send("Internal server error.");
  }
}

export async function deleteFolder(req, res) {
  const folderId = req.params.id;
  const folder = await findFolderById(folderId);
  if (!folder || folder.user_id !== req.user.id) {
    return res.status(403).send("Forbidden: You do not own this folder.");
  }
  await deleteFolderById(folderId);
  res.redirect("/");
}
