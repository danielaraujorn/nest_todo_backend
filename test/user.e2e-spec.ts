import { Test, TestingModule } from '@nestjs/testing'
import {
  createGqlAuthenticatedRequest,
  createGqlRequest,
} from './utils/createGqlRequest'
import { AppModule } from '../src/app.module'
import { CreateUserDto } from '../src/user/dto/createUser.dto'
import { objectToItem } from './utils/objectToItem'
import { randomString } from './utils/randomString'

describe('User Resolvers (e2e)', () => {
  let app
  let request

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

    await createGqlRequest(app)(registerQuery).then(
      ({
        body: {
          data: {
            register: {
              token: { accessToken },
            },
          },
        },
      }) => {
        request = createGqlAuthenticatedRequest(app, accessToken)
      },
    )
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
            }
        }
      `
    request(query)
      .expect(({ body }) => {
        const { firstName, email } = body.data.register
        expect(firstName).toBe(user.firstName)
        expect(email).toBe(user.email)
      })
      .expect(200)
  })
})
