/*
  Warnings:

  - You are about to drop the column `file_type` on the `File` table. All the data in the column will be lost.
  - Added the required column `mime_type` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "file_type",
ADD COLUMN     "format" TEXT,
ADD COLUMN     "mime_type" TEXT NOT NULL,
ADD COLUMN     "resource_type" TEXT;
