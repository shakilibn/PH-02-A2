import express from "express";
import { bookingControllers } from "./booking.controller";
import checkAuth from "../../middlewares/checkAuth";
import { Roles } from "../auth/auth.constant";

const router = express.Router();

router.post(
  "/",
  checkAuth(Roles.admin, Roles.customer),
  bookingControllers.createBooking
);

router.get(
  "/",
  checkAuth(Roles.admin, Roles.customer),
  bookingControllers.getAllBooking
);

router.put(
  "/:bookingId",
  checkAuth(Roles.admin, Roles.customer),
  bookingControllers.updateBooking
);

export const bookingRoutes = router;
