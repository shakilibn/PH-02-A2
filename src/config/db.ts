import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: config.dbUrl,
});

export const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(100) NOT NULL,
            email TEXT UNIQUE NOT NULL CHECK (email = lower(email)) CHECK(email <> ''),
            password TEXT NOT NULL,
            phone VARCHAR(18) NOT NULL,
            role VARCHAR(10) NOT NULL
        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY NOT NULL,
            vehicle_name VARCHAR(100) NOT NULL,
            type VARCHAR(10) NOT NULL,
            registration_number VARCHAR(150) UNIQUE NOT NULL,
            daily_rent_price INT NOT NULL,
            availability_status VARCHAR(12) NOT NULL
        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY NOT NULL,
            customer_id INT NOT NULL REFERENCES users(id),
            vehicle_id INT NOT NULL REFERENCES vehicles(id),
            rent_start_date TIMESTAMP NOT NULL,
            rent_end_date TIMESTAMP NOT NULL,
            total_price INT NOT NULL,
            status VARCHAR(12) NOT NULL
        )
        `);
};
