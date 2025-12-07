import { Request } from "express";
import { pool } from "../../config/db";
import { JwtPayload } from "jsonwebtoken";
import { Roles } from "../auth/auth.constant";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );

  const data = result.rows;
  let message = "Users retrieved successfully";

  if (result.rowCount === 0) {
    message = "No users found";
  }

  return {
    message,
    data,
  };
};

const updateUser = async (req: Request) => {
  const { userId } = req.params;
  const user = req.user as JwtPayload;

  if (user.role === Roles.customer && Number(userId) !== user.id) {
    throw new Error("Unauthorized to update other user's data");
  }

  const { name, email, phone, role } = req.body;

  if (role && !["admin", "customer"].includes(role as string)) {
    throw new Error(`Invalid role! Role must be "admin" or "customer".`);
  }

  const existingUserResult = await pool.query(
    `SELECT name, email, phone, role FROM users WHERE id = $1`,
    [userId]
  );

  if (existingUserResult.rowCount === 0) {
    throw new Error("No user found!");
  }

  const existingUser = existingUserResult.rows[0];

  const updated_name = name ?? existingUser.name;
  const updated_email = email ? email.toLowerCase() : existingUser.email;
  const updated_phone = phone ?? existingUser.phone;
  const updated_role = role ?? existingUser.role;

  const result = await pool.query(
    `UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *`,
    [updated_name, updated_email, updated_phone, updated_role, userId]
  );

  const data = result.rows[0];
  delete data.password;
  let message = "User updated successfully";

  return {
    message,
    data,
  };
};

const deleteUser = async (userId: string) => {
  const bookingResult = await pool.query(
    `SELECT * FROM bookings where customer_id = $1 AND status = 'active'`,
    [userId]
  );

  if ((bookingResult.rowCount as number) > 0) {
    return {
      message:
        "This user can't be deleted, because this user has active bookings!",
    };
  }

  const result = await pool.query(`DELETE FROM users where id = $1`, [userId]);

  const data = result.rows[0];
  let message = "User deleted successfully";

  if (result.rowCount === 0) {
    message = "No user found";
  }

  return { data, message };
};

export const userServices = {
  getAllUsers,
  updateUser,
  deleteUser,
};
