import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../domain/roles';
import { RolesGuard } from '../auth/roles.guard';

@Controller('documents')
@UseGuards(JwtAccessGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(UserRole.GESTAO, UserRole.ADMIN, UserRole.PROFESSOR)
  create(@Body() dto: any) {
    return this.documentsService.create(dto);
  }

  @Get()
  list(@Query('scope') scope?: string, @Query('owner') owner?: string) {
    return this.documentsService.list(scope, owner);
  }
}
