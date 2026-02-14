/*
  Warnings:

  - Added the required column `title` to the `Epoch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Epoch" ADD COLUMN     "title" TEXT NOT NULL;
