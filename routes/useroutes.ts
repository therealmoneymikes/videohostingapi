import { UserService } from "../services/UserService";
import express from "express";
import { validate } from "../middleware/userschemamiddleware";
import { UserValidationSchema } from "../validators/uservalidation";
import {
  createUserController,
  userLoginController,
} from "../controller/usercontroller";

const app = express.Router();

app.post("/signup", validate(UserValidationSchema), createUserController);
app.post(
  "/login/:username",
  validate(UserValidationSchema),
  userLoginController
);
