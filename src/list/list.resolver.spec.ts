import { Test, TestingModule } from '@nestjs/testing'
import { ListResolver } from './list.resolver'
import { ListService } from './list.service'
import { ListRepository } from './repositories/list.repository'

describe('ListResolver', () => {
  let resolver: ListResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListResolver, ListService, ListRepository],
    }).compile()

    resolver = module.get<ListResolver>(ListResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
