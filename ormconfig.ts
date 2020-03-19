const TypeOrmConfig = () => {
  const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DATABASE_URL,
  } = process.env

  const migrationsDir = '/db/migrations'

  const url =
    DATABASE_URL ||
    `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
  console.log(url)

  return {
    type: 'postgres',
    url,
    entities: [__dirname + '/**/*.entity.{ts,js}'],
    migrations: [migrationsDir + '/*.js'],
    cli: { migrationsDir },
    synchronize: true,
  }
}

module.exports = TypeOrmConfig()
