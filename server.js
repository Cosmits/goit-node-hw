import mongoose from "mongoose";
import app from "./app.js"
import envs from "./models/env.js"

const PORT = envs.PORT
const MONGO_DB_HOST = envs.MONGO_DB_HOST
console.log("🚀 ~ file: server.js:7 ~ MONGO_DB_HOST:", MONGO_DB_HOST)

async function startApp() {

  try {
    await mongoose.connect(MONGO_DB_HOST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }).then(() => console.log("Database connection successful"));

    app.listen(PORT, () => console.log(`Server start on PORT = ${PORT}`))
  } catch (error) {
    console.log(`Server not running. Error message: ${error.message}`)
    process.exit(1)
  }
}

await startApp()