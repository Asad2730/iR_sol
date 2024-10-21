import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis as RedisClient } from 'ioredis'; 

@Injectable()
export class CacheService {
  constructor(
    @InjectRedis() private readonly redis: RedisClient, 
  ) {}

  async getCache(key: string): Promise<any> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async setCache(key: string, value: any, ttl: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }
}
