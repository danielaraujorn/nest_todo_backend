import { Test, TestingModule } from '@nestjs/testing'
import { gqlAuthenticatedRequest, gqlRequest } from './utils/gqlRequest'
import { AppModule } from '../src/app.module'
import { objectToItem } from './utils/objectToItem'
import { randomString } from './utils/randomString'
import { CreateListDto } from 'src/list/dto/createList.dto'
import { createitemObject } from './utils/createItemObject'

describe('User Resolvers (e2e)', () => {
  let app
  let BearerToken
  let secondBearerToken
  let listId
  const listText = randomString()

  const user = {
    firstName: randomString(),
    email: randomString() + '@email.com',
    password: '12345678',
  }

  const secondUser = {
    firstName: randomString(),
    email: randomString() + '@email.com',
    password: '12345678',
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const registerQuery = `
        mutation{
            register(${objectToItem(user)}){
              token{
                accessToken
              }
            }
        }
      `

    await gqlRequest(app, registerQuery).then(({ body }) => {
      BearerToken = body.data.register.token.accessToken
    })

    const secondRegisterQuery = `
    mutation{
        register(${objectToItem(secondUser)}){
          token{
            accessToken
          }
        }
    }
  `

    await gqlRequest(app, secondRegisterQuery).then(({ body }) => {
      secondBearerToken = body.data.register.token.accessToken
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('creating list', () => {
    const input: CreateListDto = {
      text: randomString(),
      active: true,
    }
    const query = `
        mutation{
            upsertList(listInput:${createitemObject(input)}){
              id
              text
              active
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { id, text, active } = body.data.upsertList
        expect(active).toBe(true)
        expect(id).toBeDefined()
        listId = id
        expect(text).toBe(input.text)
      },
    )
  })
  it('upserting list', () => {
    const input: CreateListDto = {
      text: listText,
      active: false,
    }
    const query = `
        mutation{
            upsertList(id:"${listId}",listInput:${createitemObject(input)}){
              id
              text
              active
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { id, text, active } = body.data.upsertList
        expect(active).toBe(false)
        expect(id).toBe(listId)
        expect(text).toBe(listText)
      },
    )
  })
  it('upserting list with other user', () => {
    const input: CreateListDto = {
      text: listText,
    }
    const query = `
        mutation{
            upsertList(id:"${listId}",listInput:${createitemObject(input)}){
              id
              text
            }
        }
      `
    return gqlAuthenticatedRequest(app, secondBearerToken, query).expect(
      ({ body }) => {
        const { errors, data } = body
        expect(errors).toBeDefined()
        expect(data).toBeNull()
      },
    )
  })
  it('upserting list unauthenticaded', () => {
    const input: CreateListDto = {
      text: randomString(),
    }
    const query = `
        mutation{
            upsertList(listInput:${createitemObject(input)}){
              id
              text
            }
        }
      `
    return gqlRequest(app, query).expect(({ body }) => {
      const { errors, data } = body
      expect(errors).toBeDefined()
      expect(data).toBeNull()
    })
  })
  it('all lists', () => {
    const query = `
        query{
            lists{
              total
              items{
                id
                text
              }
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { total, items } = body.data.lists
        expect(total).toBe(1)
        expect(items[0].id).toBe(listId)
        expect(items[0].text).toBe(listText)
      },
    )
  })
  it('list', () => {
    const query = `
        query{
            list(id:"${listId}"){
              id
              text
              active
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { id, text, active } = body.data.list
        expect(id).toBe(listId)
        expect(text).toBe(listText)
        expect(active).toBe(false)
      },
    )
  })
  it('list from other user', () => {
    const query = `
        query{
            list(id:"${listId}"){
              id
              text
            }
        }
      `
    return gqlAuthenticatedRequest(app, secondBearerToken, query).expect(
      ({ body }) => {
        const { errors, data } = body
        expect(errors).toBeDefined()
        expect(data).toBeNull()
      },
    )
  })
})
