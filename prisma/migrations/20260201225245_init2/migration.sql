-- DropForeignKey
ALTER TABLE "Epoch" DROP CONSTRAINT "Epoch_catId_fkey";

-- AlterTable
ALTER TABLE "Epoch" ALTER COLUMN "catId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Epoch" ADD CONSTRAINT "Epoch_catId_fkey" FOREIGN KEY ("catId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
