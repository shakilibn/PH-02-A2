import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  if (!["car", "bike", "van", "SUV"].includes(type as string)) {
    throw new Error(`Invalid vehicle type!`);
  }

  if (Number(daily_rent_price) < 0) {
    throw new Error("Daily rent price should be positive");
  }

  if (!["available", "booked"].includes(availability_status as string)) {
    throw new Error(`Invalid status type!`);
  }

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) values($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);

  const data = result.rows;
  let message = "Vehicles retrieved successfully";

  if (result.rowCount === 0) {
    message = "No vehicles found";
  }

  return { data, message };
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
};
