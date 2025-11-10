import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LibraryModule } from './library/library.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeavesModule } from './leaves/leaves.module';
import { NoticesModule } from './notices/notices.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 60 }),
    PrismaModule,
    AuthModule,
    UsersModule,
    LibraryModule,
    AttendanceModule,
    LeavesModule,
    NoticesModule,
    DocumentsModule
  ]
})
export class AppModule {}
