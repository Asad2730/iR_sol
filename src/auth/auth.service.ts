import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  
  constructor(private readonly jwtService: JwtService,private readonly userService: UserService,) {}

  async login(email:string) {
    const user = await this.userService.getUserByEmail(email)
    if (!user) {
      throw new Error(`User not found with this email ${email}`);
    }
    const payload = { username: user.name, sub: user._id, role: user.role ,email:user.email};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
