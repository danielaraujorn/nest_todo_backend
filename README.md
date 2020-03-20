# Todo app back-end

## [Online playground link](https://nest-todo-backend.herokuapp.com/graphql)

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
- Deployed on Heroku

## Steps to start server

- You'll need to create a `.env` file as in `.env.sample`
- `npm install`
- `docker-compose up -d`
- `npm run start:dev`
- [Link to access your playground](http://localhost:3000/graphql)

## After register or login

- Place your token in header like: `{Authorization:'Bearer <token>'}`
