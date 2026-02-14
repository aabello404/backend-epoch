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
}

//  const imgpath=path.join(process.cwd(),"..","/assets/images/Abj-mosque.jpg");
//         try
//         {
//             const result = await cloudinary.uploader.upload(imgpath);
//             console.log(result.public_id);

//         }
//         catch(er)
//         {
//             console.log(er);
//         }

// }
// async handleUpload(data:Express.Multer.File)
// {
//     const Filepath=path.join(process.cwd(),"..","public/uploads/images",data.originalname);
//     try{
//         await fs.writeFile(Filepath,data.buffer);
//         const result= await cloudinary.uploader.upload(Filepath,
//         {folder:"/Epoch/Images"});
//         console.log(result.public_id);
//     }
//     catch(error)
//     {
//         throw error;
//     }
//     setTimeout(()=>
//     {
//         console.log("deleteing file");
//     },4000)
// }
// async  getfeed()
// {
//     cloudinary.config({
//         cloud_name:'devmzjslf',
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET
//     })
//     const url = cloudinary.url("Screenshot_2025-12-18_221851_rcx7ab",
//         {
//             transformation:
//             [
//                 {
//                     fetch_format:'auto',
//                     quality:'auto'
//                 },
//             ]
//         }
//     );
// }
// async rem()
// {
