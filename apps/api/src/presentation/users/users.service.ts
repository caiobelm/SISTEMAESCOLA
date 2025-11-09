import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({ include: { profile: true } });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: { profile: true } });
  }

  async create(dto: any) {
    const passwordHash = await argon2.hash(dto.password ?? 'Senha@123');
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role,
        status: dto.status ?? 'ACTIVE',
        profile: {
          create: {
            cpf: dto.cpf ?? '',
            phone: dto.phone ?? '',
            address: dto.address ?? '',
            avatarUrl: dto.avatarUrl ?? ''
          }
        }
      }
    });
  }

  async update(id: string, dto: any) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        role: dto.role,
        status: dto.status,
        profile: dto.profile
          ? {
              upsert: {
                create: {
                  cpf: dto.profile.cpf,
                  phone: dto.profile.phone,
                  address: dto.profile.address,
                  avatarUrl: dto.profile.avatarUrl
                },
                update: {
                  cpf: dto.profile.cpf,
                  phone: dto.profile.phone,
                  address: dto.profile.address,
                  avatarUrl: dto.profile.avatarUrl
                }
              }
            }
          : undefined
      }
    });
  }
}
