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

export async function getAllFolderFromDb() {
  const folderList = await prisma.folder.findMany({});
  return folderList;
}

export async function getAllFileFromDb() {
  const fileList = await prisma.file.findMany({});
  return fileList;
}
