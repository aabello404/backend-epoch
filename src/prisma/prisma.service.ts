import {
  ConflictException,
  Injectable,
  OnModuleInit,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Expectedobject, ExpectedobjectNew } from '../auth/auth.controller.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
interface DtoObject {
  id: number;
  title: string;
  location: string;
  year: number;
  imageUrl: string;
  description: string;
  catId: number | null;
  createdOn: Date;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private jwtService: JwtService) {
    const connectionString = process.env.DATABASE_URL;
    console.log(
      'the string we were trying to connect with ' + connectionString,
    );
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }
  async onModuleInit() {
    await this.$connect();
  }
  generatePostId(): number {
    const numbers = '1234567890';
    let id = '';
    for (let i = 0; i < numbers.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      id += numbers.charAt(j);
    }
    return parseInt(id);
  }
  async checkUser(objUser: Expectedobject) {
    const { email, hash } = objUser;
    try {
      const user = await this.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) throw new NotFoundException('Email or password incorrect');
      const isMatch = await bcrypt.compare(hash, user.hash);
      if (!isMatch) {
        throw new NotFoundException('Email or password incorrect');
      } else {
        const payload = { id: user.id, email: user.email };
        return {
          access_token: await this.jwtService.signAsync(payload),
          message: 'Logged Successfully',
        };
      }
    } catch (error: any) {
      throw error;
    }
  }
  async createUser(objNewUser: ExpectedobjectNew) {
    const saltOrRounds = 10;
    const { name, email, hash } = objNewUser;
    const hashed = await bcrypt.hash(hash, saltOrRounds);

    try {
      const newUser = await this.user.create({
        data: {
          name: name,
          email: email,
          hash: hashed,
        },
      });
      if (newUser) {
        const payload = { id: newUser.id, email: newUser.email };

        return {
          access_token: await this.jwtService.signAsync(payload),
          message: 'Account Successifully created',
        };
      }
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      )
        throw new ConflictException('Email already in use');
      throw error;
    }
  }

  async collectingtags(tagsarray: any) {
    // recuperation de tags envoyee
    const arratag: object[] = [];
    return new Promise((resolve, reject) => {
      if (!tagsarray) reject('No tags seleted');
      tagsarray.forEach((element: string) => {
        arratag.push({
          tag: {
            connectOrCreate: {
              where: { tagName: element },
              create: { tagName: element },
            },
          },
        });
        if (arratag.length > 0) {
          resolve(arratag);
        } else reject('No tag selected');
      });
    });
  }
  async getProfile(user: any) {
    try {
      const userProfile = await this.user.findUnique({
        where: {
          id: user.id,
        },
      });
      if (!userProfile) throw new NotFoundException('user not found');
      else return userProfile;
    } catch (err) {
      throw err;
    }
  }
  async uploadEpoch(result: any, obj: any, Poster: any) {
    try {
      const arratag: any = await this.collectingtags(obj.tags);

      const cateId = await this.category.findUnique({
        where: {
          nameCat: obj.category,
        },
        select: {
          id: true,
        },
      });
      if (!cateId) throw new ConflictException('category DNE');

      const saveImageBd = await this.epoch.create({
        data: {
          userId: Poster.id,
          id: this.generatePostId(),
          title: obj.title,
          catId: cateId.id,
          description: obj.description,
          imageUrl: result.url,
          location: obj.location,
          year: parseInt(obj.YearTaken),
          tags: {
            create: arratag,
          },
        },
      });
      if (!saveImageBd) {
        throw new ConflictException('Something went wrong!');
      }
      return {
        message: 'Post published',
      };
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ForbiddenException('Something went wrong!');
      throw error;
    }
  }
  async shuffle(array: DtoObject[]) {
    return new Promise<any>((resolve, reject) => {
      const shuffledPosts: DtoObject[] = [...array];
      for (let i = shuffledPosts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPosts[i], shuffledPosts[j]] = [
          shuffledPosts[j],
          shuffledPosts[i],
        ];
      }
      if (shuffledPosts.length) resolve(shuffledPosts);
      else
        reject({
          message: 'Something went wrong!',
        });
    });
  }
  async getPost() {
    try {
      const posts = await this.epoch.findMany();
      if (!posts) throw new NotFoundException('Something went wrong');
      return await this.shuffle(posts);
    } catch (error: any) {
      if (error.message === 'Something went wrong!')
        throw new NotFoundException('Something went wrong');
      throw error;
    }
  }

  async getDetails(id: number, user: any) {
    let likedByUser = false;
    const Data: {} = {};
    try {
      const post = await this.epoch.findUnique({
        where: {
          id: id,
        },
        include: {
          cat: {
            include: { epoch: true },
          },

          Post: {
            select: { name: true, profilePhotoUrl: true },
          },
        },
      });
      const likesCount = await this.likes.count({
        where: {
          epochId: id,
        },
      });
      const Tags = await this.epochTags.findMany({
        where: {
          epochId: id,
        },
      });
      const check = await this.likes.findUnique({
        where: {
          userId_epochId: {
            epochId: id,
            userId: user.id,
          },
        },
      });
      if (check) {
        likedByUser = true;
      }
      if (!post) throw new NotFoundException('bad request');
      else {
        Object.assign(Data, post, { likesCount, likedByUser }, { Tags });
        return Data;
      }
    } catch (error) {
      throw error;
    }
  }
  async CreateLike(user: any, dto: number) {
    try {
      const Like = await this.likes.create({
        data: {
          epochId: dto,
          userId: user.id,
        },
      });
      if (Like) return true;
      else throw new BadRequestException('post is already liked');
    } catch {
      return true;
    }
  }
  async RemoveLike(user: any, dto: number) {
    try {
      const unLike = await this.likes.delete({
        where: {
          userId_epochId: {
            userId: user.id,
            epochId: dto,
          },
        },
      });
      if (unLike) return true;
      else throw new BadRequestException('Something went wrong');
    } catch {}
  }

  async editProfile(result: any, user: any) {
    try {
      const editedUser = await this.user.update({
        data: {
          profilePhotoUrl: result.url,
        },
        where: {
          id: user.id,
        },
      });
      if (!editedUser) throw new ConflictException('Something went wrong');
      return { editedUser, message: 'Account edited' };
    } catch (error) {
      throw error;
    }
  }

  async getSearch(Keywords: string[]) {
    try {
      const post = await this.epochTags.findMany({
        where: {
          tag: {
            OR: Keywords.map((keyword) => ({
              tagName: keyword,
            })),
          },
        },
        select: {
          epoch: true,
        },
      });

      return post;
    } catch (err) {
      throw err;
    }
  }
}
