import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../domain/roles';
import { RolesGuard } from '../auth/roles.guard';

@Controller('leaves')
@UseGuards(JwtAccessGuard, RolesGuard)
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  @Roles(UserRole.PROFESSOR)
  create(@Body() dto: any) {
    return this.leavesService.create(dto);
  }

  @Post(':id/submit')
  @Roles(UserRole.PROFESSOR)
  submit(@Param('id') id: string) {
    return this.leavesService.updateStatus(id, 'SUBMITTED');
  }

  @Post(':id/approve')
  @Roles(UserRole.GESTAO, UserRole.ADMIN)
  approve(@Param('id') id: string, @Body('comments') comments: string) {
    return this.leavesService.updateStatus(id, 'APPROVED', comments);
  }

  @Post(':id/reject')
  @Roles(UserRole.GESTAO, UserRole.ADMIN)
  reject(@Param('id') id: string, @Body('comments') comments: string) {
    return this.leavesService.updateStatus(id, 'REJECTED', comments);
  }
}
