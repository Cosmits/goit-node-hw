import mongoose from "mongoose";
import app from "./app.js"
import envs from "./models/env.js"

const PORT = normalizePort(envs.PORT || '3000');
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


function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}