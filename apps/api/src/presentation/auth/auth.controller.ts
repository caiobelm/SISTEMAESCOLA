import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(req.user['id']);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', path: '/auth/refresh' });
    return { accessToken, user };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: Request) {
    return this.authService.refresh(req.user['id']);
  }

  @Post('forgot')
  async forgot(@Body('email') email: string) {
    // placeholder for email integration
    return { message: `Se as credenciais existirem, enviaremos um link para ${email}` };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    return { message: 'Sessão finalizada' };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }
}
