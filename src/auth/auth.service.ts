import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyService } from 'src/companies/company.service';
import type { Company } from 'src/companies/types/company.type';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private companyRepository: CompanyService,
    private jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO) {
    const company = await this.companyRepository.findCompany(LoginDTO.email);
    if (!company) {
      throw new UnauthorizedException('invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDTO.password,
      company.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload = { company };
    return {
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
      },
      token: await this.jwtService.signAsync(payload),
    };
  }

  async register(company: Company) {
    const hashedPassword = await bcrypt.hash(company.password, 10);
    const newCompany = { ...company, password: hashedPassword };

    try {
      const savedCompany = await this.companyRepository.saveCompany(newCompany);
      return savedCompany;
    } catch (err) {
      throw new BadRequestException(`err saving company: ${err}`);
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

