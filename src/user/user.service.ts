import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/createUser.dto';


@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, name, password, role } = createUserDto;
    const newUser = new this.userModel({ email, name, password, role });
    return newUser.save();
  }

  async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.userModel.find().skip(skip).limit(limit).exec();
  }

  async getUserById(userId: string) {
    return this.userModel.findById(userId).exec();
  }

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
