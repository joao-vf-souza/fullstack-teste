import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashed },
    });
    return { access_token: await this.jwt.signAsync({ sub: user.id, email: user.email }) };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return { access_token: await this.jwt.signAsync({ sub: user.id, email: user.email }) };
  }
}
