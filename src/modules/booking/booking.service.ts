import { Request } from "express";
import { pool } from "../../config/db";
import { Roles } from "../auth/auth.constant";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  if (!rent_start_date || !rent_end_date) {
    throw new Error("Start and end date are required.");
  }

  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);

  if (new Date(end) <= new Date(start)) {
    throw new Error("Start and end date are required.");
  }

  const vehicleResult = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleResult.rowCount === 0) {
    throw new Error("Vehicle Not Found");
  }

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status === "booked") {
    throw new Error("Vehicle is already booked");
  }

  const daily_price = vehicle.daily_rent_price;

  const ms_per_day = 1000 * 60 * 60 * 24;
  const number_of_days = Math.ceil(
    (end.getTime() - start.getTime()) / ms_per_day
  );

  const total_price = daily_price * number_of_days;

  const bookingResult = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  const bookingData = bookingResult.rows[0];

  const updatedVehicleResult = await pool.query(
    `UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING *`,
    ["booked", vehicle_id]
  );

  const vehicleData = updatedVehicleResult.rows[0];

  const message = "Booking created successfully";
  const data = {
    ...bookingData,
    vehicle: {
      vehicle_name: vehicleData.vehicle_name,
      daily_rent_price: vehicleData.daily_rent_price,
    },
  };

  return {
    message,
    data,
  };
};

const getAllBooking = async (req: Request) => {
  const user = req.user as JwtPayload;

  if (user.role == Roles.admin) {
    const result = await pool.query(
      `
      SELECT
         b.id,
         b.customer_id,
         b.vehicle_id, 
         TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
         TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
         b.total_price,
         b.status,
         
         u.name,
         u.email,

         v.vehicle_name,
         v.registration_number,
         v.type

      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      `
    );

    const newResult = result.rows.map((item) => {
      return {
        id: item.id,
        customer_id: item.customer_id,
        vehicle_id: item.vehicle_id,
        rent_start_date: item.rent_start_date,
        rent_end_date: item.rent_end_date,
        total_price: item.total_price,
        status: item.status,
        customer: {
          name: item.name,
          email: item.email,
        },
        vehicle: {
          vehicle_name: item.vehicle_name,
          registration_number: item.registration_number,
          type: item.type,
        },
      };
    });

    return {
      message: "Bookings retrieved successfully",
      data: newResult,
    };
  }

  const result = await pool.query(
    `
      SELECT 
         b.id,
         b.vehicle_id, 
         TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
         TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
         b.total_price,
         b.status,
         v.vehicle_name,
         v.registration_number,
         v.type
      FROM bookings b 
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      `,
    [user.id]
  );

  const newResult = result.rows.map((item) => {
    return {
      id: item.id,
      vehicle_id: item.vehicle_id,
      rent_start_date: item.rent_start_date,
      rent_end_date: item.rent_end_date,
      total_price: item.total_price,
      status: item.status,
      vehicle: {
        vehicle_name: item.vehicle_name,
        registration_number: item.registration_number,
        type: item.type,
      },
    };
  });

  return {
    message: "Your bookings retrieved successfully",
    data: newResult,
  };
};

const updateBooking = async (req: Request) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  const user = req.user as JwtPayload;

  const bookingResult = await pool.query(
    `
      SELECT * FROM bookings WHERE id = $1
   `,
    [bookingId]
  );

  if (bookingResult.rowCount === 0) {
    throw new Error("Booking not found!");
  }

  const bookingData = bookingResult.rows[0];

  if (user.role == Roles.admin) {
    if (status !== "returned") {
      throw new Error("Admin can only updated as returned");
    }

    const bookingResult = await pool.query(
      `
      UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *
      `,
      [status, bookingId]
    );

    const vehicleUpdateResult = await pool.query(
      `
      UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING *
      `,
      ["available", bookingData.vehicle_id]
    );

    const data = {
      ...bookingResult.rows[0],
      vehicle: {
        availability_status: vehicleUpdateResult.rows[0].availability_status,
      },
    };

    return {
      message: "Booking marked as returned. Vehicle is now available",
      data,
    };
  }

  if (status !== "cancelled") {
    throw new Error("User can only updated as cancelled");
  }

  if (bookingData.customer_id !== user.id) {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  const start_date = new Date(bookingResult.rows[0].start_date);

  if (today >= start_date) {
    throw new Error("Booking cannot be cancelled after start date");
  }

  const result = await pool.query(
    `
      UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *
      `,
    [status, bookingId]
  );

  return {
    message: "Booking cancelled successfully",
    data: result.rows[0],
  };
};

export const bookingServices = {
  createBooking,
  getAllBooking,
  updateBooking,
};
