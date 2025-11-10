import { Test } from '@nestjs/testing';
import { LibraryService } from '../../src/presentation/library/library.service';
import { PrismaService } from '../../src/infra/prisma/prisma.service';

const mockPrisma = () => ({
  work: { findMany: jest.fn() },
  copy: { findUnique: jest.fn(), update: jest.fn() },
  loan: { create: jest.fn(), findMany: jest.fn() }
});

describe('LibraryService', () => {
  let service: LibraryService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LibraryService, { provide: PrismaService, useFactory: mockPrisma }]
    }).compile();

    service = module.get(LibraryService);
    prisma = module.get(PrismaService) as any;
  });

  it('calcula status de empréstimos corretamente', async () => {
    const now = new Date();
    prisma.loan.findMany.mockResolvedValue([
      {
        id: '1',
        dueAt: now,
        returnedAt: null,
        copy: { work: { title: 'Livro' } },
        borrower: { name: 'Aluno' }
      }
    ]);

    const result = await service.listLoans();
    expect(result[0].status).toBe('VENCE HOJE');
  });
});
