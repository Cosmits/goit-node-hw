import dotenv from 'dotenv'
dotenv.config()

const envs = {  
  MONGO_DB_HOST: process.env.MONGO_DB_HOST,
  PORT: process.env.PORT || 3000,
}

export default envs