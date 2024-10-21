import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login with email' })
  @ApiBody({ schema: { example: { email: 'user@example.com' } } })
  async login(@Body('email') email: string) {
    return this.authService.login(email);
  }
}
