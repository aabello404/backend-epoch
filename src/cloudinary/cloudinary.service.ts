import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
} from 'cloudinary';
import { Readable } from 'stream';
import { PrismaService } from '../prisma/prisma.service';
import Multer from 'multer';

@Injectable()
export class CloudinaryService {
  constructor(private readonly prismaService: PrismaService) {
    cloudinary.config({
      cloud_name: 'devmzjslf',
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // Helper method to upload a memory buffer to Cloudinary
  private uploadBuffer(
    fileBuffer: Buffer,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            {
              fetch_format: 'auto',
              quality: 'auto',
            },
          ],
        },
        (error, result:any) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      // Convert memory buffer into a readable stream and pipe it to Cloudinary
      Readable.from(fileBuffer).pipe(uploadStream);
    });
  }

  async handleUpload(data: Express.Multer.File, obj: any, Poster: any) {
    try {
      const result = await this.uploadBuffer(data.buffer, '/Epoch/Images');

      if (result) {
        return await this.prismaService.uploadEpoch(result, obj, Poster);
      } else {
        throw new ConflictException('File upload failed');
      }
    } catch (error:any) {
      throw error instanceof ConflictException
        ? error
        : new InternalServerErrorException(error.message);
    }
  }

  async editProfile(data: Express.Multer.File, user: any) {
    try {
      const result = await this.uploadBuffer(
        data.buffer,
        '/Epoch/profilephotos',
      );

      if (result) {
        return await this.prismaService.editProfile(result, user);
      } else {
        throw new ConflictException('Something went wrong');
      }
    } catch (error:any) {
      throw error instanceof ConflictException
        ? error
        : new InternalServerErrorException(error.message);
    }
  }
}
