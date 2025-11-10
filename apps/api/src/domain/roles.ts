export enum UserRole {
  ADMIN = 'ADMIN',
  GESTAO = 'GESTAO',
  BIBLIOTECARIO = 'BIBLIOTECARIO',
  PROFESSOR = 'PROFESSOR',
  ALUNO = 'ALUNO',
  RESPONSAVEL = 'RESPONSAVEL'
}

export const roleHierarchy: Record<UserRole, number> = {
  [UserRole.ADMIN]: 5,
  [UserRole.GESTAO]: 4,
  [UserRole.BIBLIOTECARIO]: 3,
  [UserRole.PROFESSOR]: 3,
  [UserRole.ALUNO]: 1,
  [UserRole.RESPONSAVEL]: 1
};
