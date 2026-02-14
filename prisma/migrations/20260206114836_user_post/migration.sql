/*
  Warnings:

  - Added the required column `userId` to the `Epoch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Epoch" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Epoch" ADD CONSTRAINT "Epoch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
