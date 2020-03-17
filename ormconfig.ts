const TypeOrmConfig = () => {
  const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env

  const migrationsDir = '/db/migrations'

  return {
    type: 'postgres',
    url: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    entities: [__dirname + '/**/*.entity.ts'],
    migrations: [migrationsDir + '/*.js'],
    cli: { migrationsDir },
    synchronize: true,
  }
}

module.exports = TypeOrmConfig()
