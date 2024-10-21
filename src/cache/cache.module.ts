import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',                
      url: process.env.REDIS_URL,  
    }),
  ],
  providers: [CacheService],
  exports: [CacheService], 
})

export class CacheModule {}
