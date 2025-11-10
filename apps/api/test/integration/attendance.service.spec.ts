import { Test } from '@nestjs/testing';
import { AttendanceService } from '../../src/presentation/attendance/attendance.service';
import { PrismaService } from '../../src/infra/prisma/prisma.service';

describe('AttendanceService integration (mocked prisma)', () => {
  let service: AttendanceService;
  const prismaMock = {
    attendanceRecord: {
      findFirst: jest.fn(),
      create: jest.fn()
    }
  } as any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AttendanceService, { provide: PrismaService, useValue: prismaMock }]
    }).compile();
    service = moduleRef.get(AttendanceService);
    prismaMock.attendanceRecord.findFirst.mockReset();
    prismaMock.attendanceRecord.create.mockReset();
  });

  it('cria novo registro quando não há duplicidade', async () => {
    prismaMock.attendanceRecord.findFirst.mockResolvedValue(null);
    prismaMock.attendanceRecord.create.mockResolvedValue({ id: '1' });

    const record = await service.createRecord({
      date: new Date().toISOString(),
      schoolClassId: 'class',
      subjectId: 'subject',
      teacherId: 'teacher'
    });

    expect(record.id).toBe('1');
    expect(prismaMock.attendanceRecord.create).toHaveBeenCalled();
  });
});
