import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import dayjs from 'dayjs';
import { UserRole } from '../../domain/roles';

function parseDays(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const loanRules: Record<UserRole, { days: number }> = {
  [UserRole.ADMIN]: { days: 14 },
  [UserRole.GESTAO]: { days: 14 },
  [UserRole.BIBLIOTECARIO]: { days: 14 },
  [UserRole.PROFESSOR]: { days: parseDays(process.env.REGRAS_EMPRESTIMO_PROFESSOR, 14) },
  [UserRole.ALUNO]: { days: parseDays(process.env.REGRAS_EMPRESTIMO_ALUNO, 7) },
  [UserRole.RESPONSAVEL]: { days: 7 }
};

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  getWorks() {
    return this.prisma.work.findMany({ include: { copies: true } });
  }

  createWork(dto: any) {
    return this.prisma.work.create({
      data: {
        title: dto.title,
        author: dto.author,
        publisher: dto.publisher,
        year: dto.year,
        isbn: dto.isbn,
        keywords: dto.keywords,
        coverUrl: dto.coverUrl,
        subject: dto.subject
      }
    });
  }

  async createLoan(dto: any) {
    const copy = await this.prisma.copy.findUnique({ where: { id: dto.copyId } });
    if (!copy || copy.status !== 'AVAILABLE') {
      throw new BadRequestException('Exemplar indisponível');
    }
    const borrower = await this.prisma.user.findUnique({ where: { id: dto.borrowerUserId } });
    if (!borrower) {
      throw new BadRequestException('Usuário não encontrado');
    }
    const rule = loanRules[borrower.role as UserRole] ?? { days: 7 };
    const dueAt = dayjs(dto.checkoutAt ?? new Date()).add(rule.days, 'day').toDate();

    await this.prisma.copy.update({ where: { id: copy.id }, data: { status: 'LOANED' } });
    const loan = await this.prisma.loan.create({
      data: {
        copyId: copy.id,
        borrowerUserId: borrower.id,
        checkoutAt: dto.checkoutAt ?? new Date(),
        dueAt,
        renewals: 0,
        fineCents: 0
      }
    });
    return loan;
  }

  async returnLoan(id: string) {
    const loan = await this.prisma.loan.update({
      where: { id },
      data: { returnedAt: new Date() }
    });
    await this.prisma.copy.update({ where: { id: loan.copyId }, data: { status: 'AVAILABLE' } });
    return loan;
  }

  async listLoans() {
    const loans = await this.prisma.loan.findMany({
      include: {
        copy: { include: { work: true } },
        borrower: true
      }
    });
    return loans.map((loan) => {
      const status = loan.returnedAt
        ? 'DEVOLVIDO'
        : dayjs().isAfter(loan.dueAt)
        ? 'ATRASADO'
        : dayjs().isSame(loan.dueAt, 'day')
        ? 'VENCE HOJE'
        : 'NO PRAZO';
      return { ...loan, status };
    });
  }
}
