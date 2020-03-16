import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoRepository } from './repositories/todo.repository';
import { ListRepository } from 'src/list/repositories/list.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TodoRepository, ListRepository])],
  providers: [TodoService, TodoResolver],
})
export class TodoModule {}
