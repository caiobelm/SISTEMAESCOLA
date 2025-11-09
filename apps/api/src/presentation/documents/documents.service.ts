import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: any) {
    return this.prisma.document.create({
      data: {
        ownerUserId: dto.ownerUserId,
        scope: dto.scope,
        schoolClassId: dto.schoolClassId,
        title: dto.title,
        fileUrl: dto.fileUrl,
        version: dto.version ?? 1
      }
    });
  }

  list(scope?: string, owner?: string) {
    return this.prisma.document.findMany({
      where: {
        scope,
        ownerUserId: owner
      }
    });
  }
}
