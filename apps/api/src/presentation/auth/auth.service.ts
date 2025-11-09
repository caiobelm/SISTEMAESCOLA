import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { jwtConstants } from '../../config/jwt.config';
import * as argon2 from 'argon2';
import { UserRole } from '../../domain/roles';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const passwordValid = await argon2.verify(user.passwordHash, password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }

  async login(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    const payload = { sub: user.id, role: user.role };
    return {
      accessToken: await this.jwt.signAsync(payload, {
        secret: jwtConstants.accessSecret,
        expiresIn: jwtConstants.accessTtl
      }),
      refreshToken: await this.jwt.signAsync(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: jwtConstants.refreshTtl
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        profile: user.profile
      }
    };
  }

  async refresh(userId: string) {
    return this.login(userId);
  }
}
