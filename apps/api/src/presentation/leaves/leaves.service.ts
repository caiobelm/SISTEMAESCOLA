import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class LeavesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    const overlaps = await this.prisma.teacherLeave.findFirst({
      where: {
        teacherId: dto.teacherId,
        status: { in: ['SUBMITTED', 'APPROVED'] },
        OR: [
          {
            startDate: { lte: dto.endDate },
            endDate: { gte: dto.startDate }
          }
        ]
      }
    });
    if (overlaps) {
      throw new BadRequestException('Já existe licença em andamento nestas datas');
    }
    if (dto.reason === 'SAUDE' && (!dto.files || dto.files.length === 0)) {
      throw new BadRequestException('Anexo obrigatório para motivo saúde');
    }
    return this.prisma.teacherLeave.create({
      data: {
        teacherId: dto.teacherId,
        startDate: dto.startDate,
        endDate: dto.endDate,
        reason: dto.reason,
        status: 'DRAFT',
        suggestedSubstituteId: dto.suggestedSubstituteId,
        comments: dto.comments
      }
    });
  }

  async updateStatus(id: string, status: string, comments?: string) {
    return this.prisma.teacherLeave.update({
      where: { id },
      data: { status, comments }
    });
  }
}
