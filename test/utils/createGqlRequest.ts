import * as request from 'supertest'

export const createGqlAuthenticatedRequest = (app, token: string) => (
  query: string,
) =>
  request(app.getHttpServer())
    .post('/graphql')
    .set('Authetication', token)
    .send({
      operationName: null,
      query,
    })

export const createGqlRequest = app => (query: string) =>
  request(app.getHttpServer())
    .post('/graphql')
    .send({
      operationName: null,
      query,
    })
