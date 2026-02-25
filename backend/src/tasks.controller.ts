import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from './auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(@Request() req, @Body() body: { title: string; description?: string }) {
    return this.tasksService.create(req.user.sub, body);
  }

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user.sub);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() body: { title?: string; description?: string; status?: string }) {
    return this.tasksService.update(Number(id), req.user.sub, body);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.tasksService.remove(Number(id), req.user.sub);
  }
}
