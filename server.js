import mongoose from "mongoose";
import app from "./app.js"
import envs from "./models/env.js"

const PORT = envs.PORT
const MONGO_DB_HOST = envs.MONGO_DB_HOST

mongoose.connect(MONGO_DB_HOST, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(() => {
  console.log("Database connection successful")
  app.listen(PORT, () => console.log(`Server start on PORT = ${PORT}`))
}).catch(error => {
  console.log(`Server not running. Error message: ${error.message}`)
  process.exit(1)

})
