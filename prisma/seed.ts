import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const escolaNome = process.env.NOME_DA_ESCOLA ?? '{{NOME_DA_ESCOLA}}';
const cidadeUf = process.env.CIDADE_UF ?? '{{CIDADE/UF}}';
const logoUrl = process.env.LOGO_URL ?? '{{LOGO_URL}}';

function numeric(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const anoLetivo = numeric(process.env.ANO_LETIVO ?? '{{ANO_LETIVO}}', new Date().getFullYear());
const regraAluno = numeric(process.env.REGRAS_EMPRESTIMO_ALUNO ?? '{{REGRAS_EMPRESTIMO_ALUNO}}', 7);
const regraProfessor = numeric(
  process.env.REGRAS_EMPRESTIMO_PROFESSOR ?? '{{REGRAS_EMPRESTIMO_PROFESSOR}}',
  14
);

async function main() {
  await prisma.setting.upsert({
    where: { key: 'loanRules' },
    update: {},
    create: { key: 'loanRules', valueJson: { alunoDias: regraAluno, professorDias: regraProfessor } }
  });

  const adminPassword = await argon2.hash('Admin@123');
  const bibliotecarioPassword = await argon2.hash('Bibli@123');
  const professorPassword = await argon2.hash('Prof@123');
  const alunoPassword = await argon2.hash('Aluno@123');

  await prisma.user.upsert({
    where: { email: 'admin@escola.local' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@escola.local',
      passwordHash: adminPassword,
      role: 'ADMIN',
      profile: {
        create: { cpf: '00000000191', phone: '+55 11 99999-1111', address: cidadeUf, avatarUrl: logoUrl }
      }
    }
  });

  await prisma.user.upsert({
    where: { email: 'biblioteca@escola.local' },
    update: {},
    create: {
      name: 'Bibliotecária',
      email: 'biblioteca@escola.local',
      passwordHash: bibliotecarioPassword,
      role: 'BIBLIOTECARIO',
      profile: {
        create: { cpf: '00000000272', phone: '+55 11 99999-2222', address: cidadeUf, avatarUrl: '' }
      }
    }
  });

  const professorUser = await prisma.user.upsert({
    where: { email: 'professor@escola.local' },
    update: {},
    create: {
      name: 'Professor João',
      email: 'professor@escola.local',
      passwordHash: professorPassword,
      role: 'PROFESSOR',
      profile: {
        create: { cpf: '00000000353', phone: '+55 11 99999-3333', address: cidadeUf, avatarUrl: '' }
      }
    }
  });

  const teacher = await prisma.teacher.upsert({
    where: { userId: professorUser.id },
    update: {},
    create: { userId: professorUser.id, siapeMatricula: '987654', area: 'Matemática' }
  });

  const guardian = await prisma.guardian.upsert({
    where: { email: 'responsavel@escola.local' },
    update: {},
    create: { name: 'Maria Silva', phone: '+55 11 98888-4444', email: 'responsavel@escola.local' }
  });

  const alunoUser = await prisma.user.upsert({
    where: { email: 'aluno@escola.local' },
    update: {},
    create: {
      name: 'Aluno Lucas',
      email: 'aluno@escola.local',
      passwordHash: alunoPassword,
      role: 'ALUNO',
      profile: {
        create: { cpf: '00000000434', phone: '+55 11 97777-5555', address: cidadeUf, avatarUrl: '' }
      }
    }
  });

  const student = await prisma.student.upsert({
    where: { userId: alunoUser.id },
    update: {},
    create: {
      userId: alunoUser.id,
      registrationCode: '2024A0001',
      guardianId: guardian.id,
      status: 'ATIVO'
    }
  });

  await prisma.guardian.update({
    where: { id: guardian.id },
    data: { students: { connect: { id: student.id } } }
  });

  const course = await prisma.course.upsert({
    where: { name: 'Ensino Médio' },
    update: {},
    create: { name: 'Ensino Médio' }
  });

  const subject = await prisma.subject.upsert({
    where: { name: 'Matemática' },
    update: {},
    create: { name: 'Matemática', workload: 80, courseId: course.id }
  });

  const schoolClass = await prisma.schoolClass.upsert({
    where: { room: '101' },
    update: {},
    create: { year: anoLetivo, grade: '1º Ano', shift: 'Matutino', room: '101' }
  });

  await prisma.classEnrollment.upsert({
    where: { studentId_schoolClassId: { studentId: student.id, schoolClassId: schoolClass.id } },
    update: {},
    create: { studentId: student.id, schoolClassId: schoolClass.id }
  });

  await prisma.classTeacher.upsert({
    where: { teacherId_subjectId_schoolClassId: { teacherId: teacher.id, subjectId: subject.id, schoolClassId: schoolClass.id } },
    update: {},
    create: { teacherId: teacher.id, subjectId: subject.id, schoolClassId: schoolClass.id }
  });

  await prisma.schedule.upsert({
    where: { schoolClassId_subjectId_weekday: { schoolClassId: schoolClass.id, subjectId: subject.id, weekday: 1 } },
    update: {},
    create: {
      schoolClassId: schoolClass.id,
      subjectId: subject.id,
      weekday: 1,
      startTime: new Date('2024-01-01T07:30:00.000Z'),
      endTime: new Date('2024-01-01T09:00:00.000Z')
    }
  });

  const work = await prisma.work.upsert({
    where: { isbn: '9781234567890' },
    update: {},
    create: {
      title: 'Matemática Aplicada',
      author: 'Autor Desconhecido',
      publisher: 'Editora Saber',
      year: 2023,
      isbn: '9781234567890',
      keywords: 'matemática, ensino médio',
      coverUrl: logoUrl
    }
  });

  const copy = await prisma.copy.upsert({
    where: { code: 'PAT-001' },
    update: { status: 'AVAILABLE' },
    create: { workId: work.id, code: 'PAT-001', condition: 'BOM', shelf: 'A1', status: 'AVAILABLE' }
  });

  await prisma.loan.upsert({
    where: { copyId_borrowerUserId_returnedAt: { copyId: copy.id, borrowerUserId: alunoUser.id, returnedAt: null } },
    update: {},
    create: {
      copyId: copy.id,
      borrowerUserId: alunoUser.id,
      checkoutAt: new Date(),
      dueAt: new Date(Date.now() + regraAluno * 24 * 60 * 60 * 1000),
      renewals: 0,
      fineCents: 0
    }
  });

  await prisma.notice.upsert({
    where: { title: `Bem-vindos a ${escolaNome}` },
    update: {},
    create: {
      title: `Bem-vindos a ${escolaNome}`,
      body: `Iniciamos o ano letivo ${anoLetivo} com novidades no portal.`,
      audience: 'ALL',
      publishedAt: new Date()
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
