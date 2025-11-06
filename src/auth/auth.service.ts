import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import type { User } from 'src/user/types/user.type';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO) {
    const user = await this.userRepository.findUser(loginDTO.email);
    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload = { user };
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: await this.jwtService.signAsync(payload),
    };
  }

  async register(user: User) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = { ...user, password: hashedPassword };

    try {
      const savedUser = await this.userRepository.saveUser(newUser);
      return savedUser;
    } catch (err) {
      throw new BadRequestException(`err saving user: ${err}`);
    }
  }

  extract(token: string) {
    return token.split(' ')[1];
  }

  validate(token: string) {
    try {
      const decoded = this.jwtService.verifyAsync(token);
      return decoded;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
