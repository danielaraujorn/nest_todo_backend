import { Test, TestingModule } from '@nestjs/testing'
import { gqlRequest } from './utils/gqlRequest'
import { AppModule } from '../src/app.module'
import { CreateUserDto } from '../src/user/dto/createUser.dto'
import { objectToItem } from './utils/objectToItem'
import { randomString } from './utils/randomString'
import { LoginUserDto } from '../src/auth/dto/loginUser.dto'

describe('Auth Resolvers (e2e)', () => {
  let app

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  const createUser: CreateUserDto = {
    firstName: randomString(),
    email: randomString() + '@email.com',
    password: '12345678',
  }

  const registerQuery = `
    mutation{
        register(${objectToItem(createUser)}){
          success
          message
          token{
            expiresIn
            accessToken
          }
        }
    }
  `

  it('register', () =>
    gqlRequest(app, registerQuery)
      .expect(({ body }) => {
        const { success, message, token } = body.data.register
        expect(success).toBe(true)
        expect(message).toBeNull()
        expect(token).toBeDefined()
        expect(token.expiresIn).toBeDefined()
        expect(token.accessToken).toBeDefined()
      })
      .expect(200))

  it('register again with the same email', () =>
    gqlRequest(app, registerQuery)
      .expect(({ body }) => {
        const { success, message } = body.data.register
        expect(success).toBe(false)
        expect(message).toBeDefined()
      })
      .expect(200))

  it('login', () => {
    const input: LoginUserDto = {
      email: createUser.email,
      password: createUser.password,
    }

    const query = `
      mutation{
          login(${objectToItem(input)}){
            success
            message
            token{
              expiresIn
              accessToken
            }
          }
      }
    `
    return gqlRequest(app, query)
      .expect(({ body }) => {
        const { success, message, token } = body.data.login
        expect(success).toBe(true)
        expect(message).toBeNull()
        expect(token).toBeDefined()
        expect(token.expiresIn).toBeDefined()
        expect(token.accessToken).toBeDefined()
      })
      .expect(200)
  })

  it('login with wrong password', () => {
    const input: LoginUserDto = {
      email: createUser.email,
      password: createUser.password + '1',
    }

    const query = `
      mutation{
          login(${objectToItem(input)}){
            success
            message
            token{
              expiresIn
              accessToken
            }
          }
      }
    `
    return gqlRequest(app, query)
      .expect(({ body }) => {
        const { success, message } = body.data.login
        expect(success).toBe(false)
        expect(message).toBeDefined()
      })
      .expect(200)
  })
})
