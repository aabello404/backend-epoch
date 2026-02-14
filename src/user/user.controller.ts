import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  @Put('upload')
  @UseInterceptors(FileInterceptor('photo'))
  async check(
    @UploadedFile() data: Express.Multer.File,
    @Body() obj: any,
    @Request() req: any,
  ) {
    console.log(obj, req.user);
    return this.cloudinaryService.handleUpload(data, obj, req.user);
  }
  @Get('getPost')
  getPost() {
    return this.userService.getPost();
  }
  @Get('post')
  getpostDetails(@Query('id') id: any, @Request() req: any) {
    return this.userService.getDetails(parseInt(id), req.user);
  }
  @Get('profile')
  getProfile(@Request() req: any) {
    // console.log(req.user);
    return this.userService.getProfile(req.user);
  }
  @Put('editprofile')
  @UseInterceptors(FileInterceptor('editProfilphoto'))
  editProfile(@UploadedFile() data: Express.Multer.File, @Request() req: any) {
    return this.cloudinaryService.editProfile(data, req.user);
  }

  @Get('search')
  getSearch(@Query('query') dto: any) {
    return this.userService.getSearch(dto);
  }
}

// @Get()
//     hello()
//     {
//         this.userService.getfeed();
//     }
//     @Post("upload")
//     @UseInterceptors(FileInterceptor('photo'))
//     check(@Body() data:any)
//     {
//         //console.log(data.photo.files[0]);
//     }
