import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UserService {
  constructor(
    private readonly cloudService: CloudinaryService,
    private readonly prismaService: PrismaService,
  ) {}

  async handleUpload(data: Express.Multer.File, obj: any) {
    return this.handleUpload(data, obj);
  }
  async getPost() {
    return this.prismaService.getPost();
  }
  async getDetails(id: number, user: any) {
    return this.prismaService.getDetails(id, user);
  }
  async getProfile(user: any) {
    return this.prismaService.getProfile(user);
  }
  async getSearch(dto: string) {
    let arrayKeyWords = dto.split(' ');
    arrayKeyWords = arrayKeyWords.map((e) => e.toLowerCase());
    return this.prismaService.getSearch(arrayKeyWords);
  }
  async getUserPosts(id:number)
  {
    const result = await this.prismaService.epoch.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdOn: 'desc',
      },
    });
    return result;
  }
  async getUserDP(id: { id: number }) {
    const result = await this.prismaService.user.findUnique({
      where: {
        id: id.id,
      },
      select: {
        profilePhotoUrl: true,
      },
    });
    return result;
  }
}
