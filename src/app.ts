import express from "express";
import { initDB } from "./config/db";
import { authRoutes } from "./modules/auth/auth.route";
import { vehicleRoutes } from "./modules/vehicle/vehicle.route";

const app = express();
app.use(express.json());

initDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);

export default app;
