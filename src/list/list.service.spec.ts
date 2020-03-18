import { Test, TestingModule } from '@nestjs/testing'
import { ListService } from './list.service'
import { ListRepository } from './repositories/list.repository'

describe('ListService', () => {
  let service: ListService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListService, ListRepository],
    }).compile()

    service = module.get<ListService>(ListService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
