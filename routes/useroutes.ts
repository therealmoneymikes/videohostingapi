import { UserService } from "../services/UserService";
import express from "express";
import { validate } from "../middleware/userschemamiddleware";
import { UserValidationSchema } from "../validators/uservalidation";
import {
  createUserController,
  userLoginController,
} from "../controller/usercontroller";

const router = express.Router();

router.post("/signup", validate(UserValidationSchema), createUserController);
router.post("/login/:username",validate(UserValidationSchema), userLoginController);

export default router;
