import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import type { User } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDTO: LoginDTO) {
    const { company, token } = await this.authService.login(loginDTO);
    return { company: company, token: token };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: User): Promise<object> {
    const res = await this.authService.register(user);
    return res;
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: Request) {
    const authHeader = req.headers['authorization'] as string;
    if (!authHeader) throw new UnauthorizedException('no token provided');

    const token = this.authService.extract(authHeader);
    if (!token) throw new UnauthorizedException('invalid token format');

    const data = (await this.authService.validate(token)) as User;
    return data;
  }
}

