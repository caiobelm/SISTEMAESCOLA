import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class NoticesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: any) {
    return this.prisma.notice.create({
      data: {
        title: dto.title,
        body: dto.body,
        audience: dto.audience,
        targetId: dto.targetId,
        publishedAt: dto.publishedAt ?? new Date()
      }
    });
  }

  list(audience?: string) {
    return this.prisma.notice.findMany({
      where: audience ? { audience } : undefined,
      orderBy: { publishedAt: 'desc' }
    });
  }
}
