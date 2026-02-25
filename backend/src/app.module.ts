import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'segredo-jwt',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, TasksController],
  providers: [PrismaService, AuthService, TasksService],
})
export class AppModule {}
