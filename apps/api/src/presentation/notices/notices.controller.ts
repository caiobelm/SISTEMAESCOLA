import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../domain/roles';
import { RolesGuard } from '../auth/roles.guard';

@Controller('notices')
@UseGuards(JwtAccessGuard, RolesGuard)
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  @Roles(UserRole.GESTAO, UserRole.ADMIN, UserRole.PROFESSOR)
  create(@Body() dto: any) {
    return this.noticesService.create(dto);
  }

  @Get()
  getAll(@Query('audience') audience?: string) {
    return this.noticesService.list(audience);
  }
}
