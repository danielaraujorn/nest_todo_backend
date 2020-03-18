import * as request from 'supertest'

export const gqlAuthenticatedRequest = (app, token: string, query: string) =>
  request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', 'Bearer ' + token)
    .send({
      operationName: null,
      query,
    })

export const gqlRequest = (app, query: string) =>
  request(app.getHttpServer())
    .post('/graphql')
    .send({
      operationName: null,
      query,
    })
