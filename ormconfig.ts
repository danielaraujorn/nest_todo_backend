const TypeOrmConfig = () => {
  const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DATABASE_URL,
    NODE_ENV,
  } = process.env

  const migrationsDir = '/db/migrations'
  const url =
    DATABASE_URL ||
    `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

  const entities =
    NODE_ENV === 'production'
      ? ['dist/**/*.entity.js']
      : [__dirname + '/**/*.entity.ts']

  return {
    type: 'postgres',
    url,
    entities,
    migrations: [migrationsDir + '/*.js'],
    cli: { migrationsDir },
    synchronize: true,
  }
}

module.exports = TypeOrmConfig()
