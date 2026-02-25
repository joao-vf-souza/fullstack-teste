import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;

    if (!header) throw new UnauthorizedException('Token não fornecido');

    const token = header.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token não fornecido');

    try {
      request.user = await this.jwt.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }
}
