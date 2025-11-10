import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LibraryService } from './library.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../domain/roles';
import { RolesGuard } from '../auth/roles.guard';

@Controller('library')
@UseGuards(JwtAccessGuard, RolesGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('works')
  @Roles(UserRole.BIBLIOTECARIO, UserRole.ADMIN, UserRole.ALUNO, UserRole.PROFESSOR)
  getWorks() {
    return this.libraryService.getWorks();
  }

  @Post('works')
  @Roles(UserRole.BIBLIOTECARIO, UserRole.ADMIN)
  createWork(@Body() dto: any) {
    return this.libraryService.createWork(dto);
  }

  @Post('loans')
  @Roles(UserRole.BIBLIOTECARIO, UserRole.ADMIN)
  createLoan(@Body() dto: any) {
    return this.libraryService.createLoan(dto);
  }

  @Post('loans/:id/return')
  @Roles(UserRole.BIBLIOTECARIO, UserRole.ADMIN)
  returnLoan(@Param('id') id: string) {
    return this.libraryService.returnLoan(id);
  }

  @Get('loans')
  @Roles(
    UserRole.BIBLIOTECARIO,
    UserRole.ADMIN,
    UserRole.ALUNO,
    UserRole.PROFESSOR,
    UserRole.RESPONSAVEL
  )
  listLoans() {
    return this.libraryService.listLoans();
  }
}
