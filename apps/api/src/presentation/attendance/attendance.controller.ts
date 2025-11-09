import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../domain/roles';
import { RolesGuard } from '../auth/roles.guard';

@Controller('attendance')
@UseGuards(JwtAccessGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('records')
  @Roles(UserRole.PROFESSOR)
  createRecord(@Body() dto: any) {
    return this.attendanceService.createRecord(dto);
  }

  @Post('records/:id/items')
  @Roles(UserRole.PROFESSOR)
  saveItems(@Param('id') id: string, @Body() dto: any) {
    return this.attendanceService.saveItems(id, dto.items);
  }

  @Get('stats/:studentId')
  @Roles(UserRole.ALUNO, UserRole.RESPONSAVEL, UserRole.GESTAO, UserRole.PROFESSOR)
  stats(@Param('studentId') studentId: string) {
    return this.attendanceService.getStats(studentId);
  }
}
