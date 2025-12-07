import express from "express";
import checkAuth from "../../middlewares/checkAuth";
import { Roles } from "../auth/auth.constant";
import { userControllers } from "./user.controller";

const router = express.Router();

router.get("/", checkAuth(Roles.admin), userControllers.getAllUsers);
router.put(
  "/:userId",
  checkAuth(Roles.admin, Roles.customer),
  userControllers.updateUser
);

router.delete("/:userId", checkAuth(Roles.admin), userControllers.deleteUser);

export const userRoutes = router;
