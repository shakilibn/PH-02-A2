import express from "express";
import { vehicleControllers } from "./vehicle.controller";
import checkAuth from "../../middlewares/checkAuth";
import { Roles } from "../auth/auth.constant";

const router = express.Router();

router.post("/", checkAuth(Roles.admin), vehicleControllers.createVehicle);
router.get("/", vehicleControllers.getAllVehicles);

router.get("/:vehicleId", vehicleControllers.getSingleVehicle);
router.put(
  "/:vehicleId",
  checkAuth(Roles.admin),
  vehicleControllers.udpateVehicle
);

router.delete(
  "/:vehicleId",
  checkAuth(Roles.admin),
  vehicleControllers.deleteVehicle
);

export const vehicleRoutes = router;
