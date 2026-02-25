import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, data: { title: string; description?: string }) {
    return this.prisma.task.create({
      data: { ...data, userId },
    });
  }

  findAll(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, userId: number, data: { title?: string; description?: string; status?: string }) {
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');

    return this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        completedAt: data.status === 'concluída' ? new Date() : undefined,
      },
    });
  }

  async remove(id: number, userId: number) {
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');

    return this.prisma.task.delete({ where: { id } });
  }
}
