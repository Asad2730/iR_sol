import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }
    const objectId = new Types.ObjectId(userId);
    return this.userModel.findById(objectId).exec();
  }
  

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
