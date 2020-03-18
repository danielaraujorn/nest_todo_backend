import { Test, TestingModule } from '@nestjs/testing'
import { TodoService } from './todo.service'
import { TodoRepository } from './repositories/todo.repository'
import { ListRepository } from '../list/repositories/list.repository'

describe('TodoService', () => {
  let service: TodoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService, TodoRepository, ListRepository],
    }).compile()

    service = module.get<TodoService>(TodoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
