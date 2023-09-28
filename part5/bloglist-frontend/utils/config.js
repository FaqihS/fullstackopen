const { configDotenv } = require("dotenv")

configDotenv()
const DB_URL = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;
const PORT = Number(process.env.PORT);

module.exports = { DB_URL , PORT }
