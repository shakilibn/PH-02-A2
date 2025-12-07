import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  dbUrl: process.env.DATABASE_URL,
};

export default config;
