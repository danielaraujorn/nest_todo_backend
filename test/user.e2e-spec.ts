import { Test, TestingModule } from '@nestjs/testing'
import { gqlAuthenticatedRequest, gqlRequest } from './utils/gqlRequest'
import { AppModule } from '../src/app.module'
import { CreateUserDto } from '../src/user/dto/createUser.dto'
import { objectToItem } from './utils/objectToItem'
import { randomString } from './utils/randomString'

describe('User Resolvers (e2e)', () => {
  let app
  let BearerToken

  const user = {
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

    const createUser: CreateUserDto = user

    const registerQuery = `
        mutation{
            register(${objectToItem(createUser)}){
              token{
                accessToken
              }
            }
        }
      `

    await gqlRequest(app, registerQuery).then(({ body }) => {
      BearerToken = body.data.register.token.accessToken
    })
  })

  afterAll(async () => {
    await app.close()
  })
  it('ownUser', () => {
    const query = `
        query{
            ownUser{
              id
              email
              firstName
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { firstName, email, id } = body.data.ownUser
        expect(id).toBeDefined()
        expect(firstName).toBe(user.firstName)
        expect(email).toBe(user.email)
      },
    )
  })
  it('ownUser not authenticated', () => {
    const query = `
        query{
            ownUser{
              id
            }
        }
      `
    return gqlRequest(app, query).expect(({ body }) => {
      const { errors, data } = body
      expect(errors).toBeDefined()
      expect(data).toBeNull()
    })
  })
})
