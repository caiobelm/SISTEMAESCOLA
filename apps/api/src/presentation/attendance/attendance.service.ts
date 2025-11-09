import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createRecord(dto: any) {
    const existing = await this.prisma.attendanceRecord.findFirst({
      where: {
        date: new Date(dto.date),
        schoolClassId: dto.schoolClassId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId
      }
    });
    if (existing) {
      throw new BadRequestException('Registro já existe para esta aula');
    }
    return this.prisma.attendanceRecord.create({
      data: {
        date: new Date(dto.date),
        schoolClassId: dto.schoolClassId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        status: dto.status ?? 'DRAFT'
      }
    });
  }

  async saveItems(recordId: string, items: any[]) {
    await this.prisma.attendanceItem.deleteMany({ where: { attendanceRecordId: recordId } });
    await this.prisma.attendanceItem.createMany({
      data: items.map((item) => ({
        attendanceRecordId: recordId,
        studentId: item.studentId,
        status: item.status,
        notes: item.notes ?? ''
      }))
    });
    return this.prisma.attendanceItem.findMany({ where: { attendanceRecordId: recordId } });
  }

  async getStats(studentId: string) {
    const items = await this.prisma.attendanceItem.groupBy({
      by: ['status'],
      where: { studentId },
      _count: { _all: true }
    });
    const total = items.reduce((acc, item) => acc + item._count._all, 0);
    return {
      total,
      summary: items,
      attendanceRate:
        total === 0
          ? 100
          : Math.round(
              ((items.find((i) => i.status === 'P')?._count._all ?? 0) / total) * 100
            )
    };
  }
}
