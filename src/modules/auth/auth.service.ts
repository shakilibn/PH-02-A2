import { pool } from "../../config/db";
import bcrypt, { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  if ((password as string).length < 6) {
    throw new Error("Password must be at lease 6 characters length");
  }

  if (!["admin", "customer"].includes(role as string)) {
    throw new Error(`Invalid role! Role must be "admin" or "customer".`);
  }

  const emailMin = (email as string).toLowerCase();
  const hashedPassword = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) values($1, $2, $3, $4, $5) RETURNING *`,
    [name, emailMin, hashedPassword, phone, role]
  );

  delete result.rows[0].password;

  return result.rows[0];
};

const userSignIn = async (payload: Record<string, string>) => {
  const { email, password } = payload;

  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (result.rowCount === 0) {
    throw new Error("No user found!");
  }

  const user = result.rows[0];
  const isMatched = await bcrypt.compare(password as string, user.password);

  if (!isMatched) {
    throw new Error("Authentication Failed");
  }

  const { id, name, role } = user;

  const token = jwt.sign(
    { id, name, email, role },
    config.jwtSecret as string,
    { expiresIn: "1d" }
  );

  delete user.password;
  console.log(user, isMatched);

  return { token, user };
};

export const authServices = {
  createUser,
  userSignIn,
};
