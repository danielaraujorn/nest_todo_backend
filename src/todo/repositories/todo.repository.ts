import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { TodoEntity } from '../entities/todo.entity';

@EntityRepository(TodoEntity)
export class TodoRepository extends Repository<TodoEntity> {}
