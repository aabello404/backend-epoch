import { ConflictException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';
import { promises as fs } from 'fs';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class CloudinaryService {
  constructor(private readonly prismaService: PrismaService) {
    cloudinary.config({
      cloud_name: 'devmzjslf',
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  async handleUpload(data: Express.Multer.File, obj: any, Poster: any) {
    const Filepath = path.join(
      process.cwd(),
      '..',
      'public/uploads/images',
      data.originalname,
    );
    try {
      await fs.writeFile(Filepath, data.buffer);
      const result = await cloudinary.uploader.upload(Filepath, {
        folder: '/Epoch/Images',
        transformation: [
          {
            fetch_format: 'auto',
            quality: 'auto',
          },
        ],
      });
      if (result) return this.prismaService.uploadEpoch(result, obj, Poster);
      else {
        throw new ConflictException('File upload failed');
      }
    } catch (error) {
      throw error;
    }
  }
  async editProfile(data: Express.Multer.File, user: any) {
    const Filepath = path.join(
      process.cwd(),
      '..',
      'public/uploads/images',
      data.originalname,
    );
    await fs.writeFile(Filepath, data.buffer);
    const result = await cloudinary.uploader.upload(Filepath, {
      folder: '/Epoch/profilephotos',
      transformation: [
        {
          fetch_format: 'auto',
          quality: 'auto',
        },
      ],
    });

    if (result) return this.prismaService.editProfile(result, user);
    else throw new ConflictException('Something went wrong');
  }
}
