import { configDotenv } from "dotenv";

configDotenv()
const DB_URL = process.env.MONGODB_URI;
const PORT = process.env.PORT;

export { DB_URL , PORT };
