import express from "express";
import {
  registerUserController,
  authUserController,
  refreshAccessTokenController,
  logoutUserController,
} from "../controllers/userController.js";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/register", validateRegister, registerUserController);

router.post("/login", validateLogin, authUserController);

router.get("/refresh", refreshAccessTokenController);
router.post("/logout", logoutUserController);

export default router;
