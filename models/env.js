import dotenv from 'dotenv'
dotenv.config()

const envs = {
  
  MONGO_DB_HOST: process.env.MONGO_DB_HOST,
  PORT: process.env.PORT || 5000,

  // POSTGRESQL_HOST: process.env.POSTGRESQL_HOST,
  // POSTGRESQL_DB: process.env.POSTGRESQL_DB,
  // POSTGRESQL_USER: process.env.POSTGRESQL_USER,
  // POSTGRESQL_PASSWORD: process.env.POSTGRESQL_PASSWORD
}

export default envs