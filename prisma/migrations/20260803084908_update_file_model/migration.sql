-- DropIndex
DROP INDEX "File_stored_name_key";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "cloud_url" TEXT,
ADD COLUMN     "public_id" TEXT,
ALTER COLUMN "stored_name" DROP NOT NULL,
ALTER COLUMN "file_path" DROP NOT NULL;
