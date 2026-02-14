import { SetMetadata } from '@nestjs/common';
export const jwtConstants = {
  secret: 'az12TEYDnq7352bdhelsHstdbeuKLOZEP4NDJ@kf#R',
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
