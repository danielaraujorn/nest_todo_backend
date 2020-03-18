import { Test, TestingModule } from '@nestjs/testing'
import { TodoResolver } from './todo.resolver'
import { TodoService } from './todo.service'
import { TodoRepository } from './repositories/todo.repository'
import { ListRepository } from '../list/repositories/list.repository'

describe('TodoResolver', () => {
  let resolver: TodoResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoResolver, TodoService, TodoRepository, ListRepository],
    }).compile()

    resolver = module.get<TodoResolver>(TodoResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
