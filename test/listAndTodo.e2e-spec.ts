import { Test, TestingModule } from '@nestjs/testing'
import { gqlAuthenticatedRequest, gqlRequest } from './utils/gqlRequest'
import { AppModule } from '../src/app.module'
import { objectToItem } from './utils/objectToItem'
import { randomString } from './utils/randomString'
import { CreateListDto } from 'src/list/dto/createList.dto'
import { createitemObject } from './utils/createItemObject'
import { CreateTodoDto } from 'src/todo/dto/createTodo.dto'

describe('Lists and Todos Resolvers (e2e)', () => {
  let app
  let BearerToken
  let secondBearerToken
  const lists: {
    id?: string
    text?: string
    todos?: { id?: string }[]
  }[] = [{ text: randomString(), todos: [] }, {}, {}]

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
    }
    const query = `
        mutation{
            upsertList(
              listInput:${createitemObject(input)}
              ){
              id
              text
              deleted
              todos{
                id
              }
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { id, text, deleted, todos } = body.data.upsertList
        expect(deleted).toBe(false)
        expect(id).toBeDefined()
        lists[0].id = id
        expect(todos.length).toBe(0)
        expect(text).toBe(input.text)
      },
    )
  })

  it('creating second list', () => {
    const input: CreateListDto = {
      text: randomString(),
    }
    const query = `
        mutation{
            upsertList(
              listInput:${createitemObject(input)}
              ){
              id
              text
              deleted
              todos{
                id
              }
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { id, text, deleted, todos } = body.data.upsertList
        expect(deleted).toBe(false)
        expect(id).toBeDefined()
        lists[1].id = id
        expect(todos.length).toBe(0)
        expect(text).toBe(input.text)
      },
    )
  })

  it('creating list with another user', () => {
    const input: CreateListDto = {
      text: randomString(),
    }
    const query = `
        mutation{
            upsertList(
              listInput:${createitemObject(input)}
              ){
              id
              text
              todos{
                id
              }
            }
        }
      `
    return gqlAuthenticatedRequest(app, secondBearerToken, query).expect(
      ({ body }) => {
        const { id, text, todos } = body.data.upsertList
        expect(id).toBeDefined()
        lists[2].id = id
        expect(todos.length).toBe(0)
        expect(text).toBe(input.text)
      },
    )
  })

  it('creating todo', () => {
    const input: CreateTodoDto = {
      text: randomString(),
      listId: lists[0].id,
    }
    const query = `
        mutation{
            upsertTodo(
              todoInput:${createitemObject(input)}
              ){
              id
              text
              completed
              list{
                id
              }
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { id, text, completed, list } = body.data.upsertTodo
        expect(completed).toBe(false)
        expect(id).toBeDefined()
        expect(text).toBe(input.text)
        lists[0].todos[0] = { id }
        expect(list.id).toBe(input.listId)
      },
    )
  })

  it('creating todo with another user', () => {
    const input: CreateTodoDto = {
      text: randomString(),
      listId: lists[2].id,
      completed: true,
    }
    const query = `
        mutation{
            upsertTodo(
              todoInput:${createitemObject(input)}
              ){
              id
              text
              completed
              list{
                id
              }
            }
        }
      `
    return gqlAuthenticatedRequest(app, secondBearerToken, query).expect(
      ({ body }) => {
        const { id, text, completed, list } = body.data.upsertTodo
        expect(completed).toBe(true)
        expect(id).toBeDefined()
        expect(text).toBe(input.text)
        expect(list.id).toBe(input.listId)
      },
    )
  })

  it('upserting list', () => {
    const input: CreateListDto = {
      text: lists[0].text,
    }
    const query = `
        mutation{
            upsertList(id:"${lists[0].id}",
            listInput:${createitemObject(input)}){
              id
              text
              deleted
              todos{
                id
              }
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { id, text, deleted, todos } = body.data.upsertList
        expect(deleted).toBe(false)
        expect(id).toBe(lists[0].id)
        expect(todos.length).toBe(1)
        expect(text).toBe(lists[0].text)
      },
    )
  })

  it('upserting list with other user', () => {
    const input: CreateListDto = {
      text: randomString(),
    }
    const query = `
        mutation{
            upsertList(id:"${lists[0].id}",
            listInput:${createitemObject(input)}){
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

  it('todos', () => {
    const todoId = lists[0].todos[0].id
    const query = `
        query{
          todos{
              total
              items{
                id
              }
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { total, items } = body.data.todos
        expect(total).toBe(1)
        expect(items[0].id).toBe(todoId)
        expect(items.length).toBe(1)
      },
    )
  })

  it('todo', () => {
    const todoId = lists[0].todos[0].id
    const query = `
        query{
          todo(id:"${todoId}"){
              id
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { id } = body.data.todo
        expect(id).toBe(todoId)
      },
    )
  })

  it('upserting todo', () => {
    const todoId = lists[0].todos[0].id
    const input: CreateTodoDto = {
      text: randomString(),
      completed: true,
      listId: lists[1].id,
    }
    const query = `
        mutation{
          upsertTodo(
            id:"${todoId}",
            todoInput:${createitemObject(input)}
            ){
              id
              text
              completed
              list{
                id
              }
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { id, text, completed, list } = body.data.upsertTodo
        expect(completed).toBe(true)
        expect(id).toBe(todoId)
        expect(text).toBe(input.text)
        expect(list.id).toBe(lists[1].id)
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
        expect(total).toBe(2)
        expect(items[0].id).toBe(lists[0].id)
        expect(items[0].text).toBe(lists[0].text)
      },
    )
  })
  it('list', () => {
    const query = `
        query{
            list(id:"${lists[0].id}"){
              id
              text
              deleted
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { id, text, deleted } = body.data.list
        expect(id).toBe(lists[0].id)
        expect(text).toBe(lists[0].text)
        expect(deleted).toBe(false)
      },
    )
  })
  it('list from other user', () => {
    const query = `
        query{
            list(id:"${lists[0].id}"){
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

  it('delete todo without permission', () => {
    const query = `
        mutation{
            deleteTodo(id:"${lists[0].todos[0].id}",deleted:true){
              id
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
  it('delete todo', () => {
    const query = `
        mutation{
            deleteTodo(id:"${lists[0].todos[0].id}",deleted:true){
              id
              text
              deleted
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { id, text, deleted } = body.data.deleteTodo
        expect(id).toBe(lists[0].todos[0].id)
        expect(text).toBeDefined()
        expect(deleted).toBe(true)
      },
    )
  })

  it('delete list without permission', () => {
    const query = `
        mutation{
            deleteTodo(id:"${lists[0].id}",deleted:true){
              id
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
  it('delete list', () => {
    const query = `
        mutation{
            deleteList(id:"${lists[0].id}",deleted:true){
              id
              text
              deleted
            }
        }
      `
    return gqlAuthenticatedRequest(app, BearerToken, query).expect(
      ({ body }) => {
        const { id, text, deleted } = body.data.deleteList
        expect(id).toBe(lists[0].id)
        expect(text).toBe(lists[0].text)
        expect(deleted).toBe(true)
      },
    )
  })
})
