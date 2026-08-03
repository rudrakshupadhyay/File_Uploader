import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export async function insertIntoDb(data) {
  const { username, firstname, lastname, password } = data;
  const password_hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      first_name: firstname,
      last_name: lastname,
      password_hash: password_hash,
    },
  });
  return user;
}

export async function uniqueUsername(username) {
  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (existingUser) {
    throw new Error("Username is already in use");
  }
  return true;
}

export async function insertFolderIntoDb(data) {
  const { name, user_id } = data;
  const folder = await prisma.folder.create({
    data: {
      name,
      user_id,
    },
  });
  return folder;
}

export async function findFolderById(folderId) {
  const folder = await prisma.folder.findUnique({
    where: {
      id: parseInt(folderId),
    },
    include: {
      files: true,
    },
  });
  return folder;
}

export async function updateFolderInDb(folderId, newName) {
  const updatedFolder = await prisma.folder.update({
    where: {
      id: parseInt(folderId),
    },
    data: {
      name: newName,
    },
  });
  return updatedFolder;
}

export async function deleteFolderById(folderId) {
  const deletedFolder = await prisma.folder.delete({
    where: {
      id: parseInt(folderId),
    },
  });
  return deletedFolder;
}

export async function insertFileIntoDb(data) {

  const {
    original_name,
    size,
    createdAt,
    updatedAt,
    folder_id,
    user_id,
    cloud_url,
    public_id,
    format,
    mime_type,
    resource_type,
  } = data;

  const file = await prisma.file.create({
    data: {
      original_name,
      size,
      createdAt,
      updatedAt,
      folder_id: parseInt(folder_id),
      user_id: parseInt(user_id),
      cloud_url,
      public_id,
      format,
      mime_type,
      resource_type,
    },
  });
  return file;
}

export async function deleteFileById(fileId) {
  const deletedFile = await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
  return deletedFile;
}

export async function findFileById(fileId) {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });
  return file;
}
