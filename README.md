# Todo app back-end

## Made using

- Nest
- Typeorm
- Graphql
- JWT
- Passport
- Postgres
- Docker Compose
- Tslint
- Prettier
- E2E tests

## Steps to start server

- You'll need to create a `.env` file as in `.env.sample`
- `npm install`
- `docker-compose up -d`
- `npm run start:dev`
- [Link to access your playground](http://localhost:3000/graphql)

## After register or login

- Place your token in header like: `{Authorization:'Bearer <token>'}`

## Next steps

- List and Todos E2E Tests
