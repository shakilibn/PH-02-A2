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

const getSingleVehicle = async (vehicleId: string) => {
  const result = await pool.query(`SELECT * FROM vehicles where id = $1`, [
    vehicleId,
  ]);

  const data = result.rows[0];
  let message = "Vehicles retrieved successfully";

  if (result.rowCount === 0) {
    message = "No vehicles found";
  }

  return { data, message };
};

const updateVehicle = async (
  vehicleId: string,
  payload: Record<string, unknown>
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  if (type && !["car", "bike", "van", "SUV"].includes(type as string)) {
    throw new Error(`Invalid vehicle type!`);
  }

  if (daily_rent_price && Number(daily_rent_price) < 0) {
    throw new Error("Daily rent price should be positive");
  }

  if (
    availability_status &&
    !["available", "booked"].includes(availability_status as string)
  ) {
    throw new Error(`Invalid status type!`);
  }

  const existingVehicleResult = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [vehicleId]
  );

  if (existingVehicleResult.rowCount === 0) {
    return {
      message: "No vehicles found",
      data: {},
    };
  }

  const existingVechicle = existingVehicleResult.rows[0];

  const update_vehicle_name = vehicle_name ?? existingVechicle.vehicle_name;
  const update_type = type ?? existingVechicle.type;
  const updated_registration_number =
    registration_number ?? existingVechicle.registration_number;
  const updated_daily_rent_price =
    daily_rent_price ?? existingVechicle.daily_rent_price;
  const updated_availability_status =
    availability_status ?? existingVechicle.availability_status;

  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name = $1 , type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *`,
    [
      update_vehicle_name,
      update_type,
      updated_registration_number,
      updated_daily_rent_price,
      updated_availability_status,
      vehicleId,
    ]
  );

  const data = result.rows[0];
  let message = "Vehicle updated successfully";

  return {
    message,
    data,
  };
};

const deleteVehicle = async (vehicleId: string) => {
  const bookingResult = await pool.query(
    `SELECT * FROM bookings where vehicle_id = $1 AND status = 'active'`,
    [vehicleId]
  );

  if ((bookingResult.rowCount as number) > 0) {
    return {
      message:
        "This vehicle can't be deleted, because this vehicle has active bookings!",
    };
  }

  const result = await pool.query(`DELETE FROM vehicles where id = $1`, [
    vehicleId,
  ]);

  const data = result.rows[0];
  let message = "Vehicle deleted successfully";

  if (result.rowCount === 0) {
    message = "No vehicles found";
  }

  return { data, message };
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
