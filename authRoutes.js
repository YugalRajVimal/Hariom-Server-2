import express from "express";
import jwtAuth from "./middlewares/auth.middleware.js";
import AuthController from "./controllers/authController.js";

const authRouter = express.Router();

const authController = new AuthController();
authRouter.get("/", (req, res) => {
  res.send("Welcome to auth router");
});

authRouter.post("/signin", (req, res) => {
  authController.userSignIn(req, res);
});

authRouter.post("/reset-password", (req, res) => {
  authController.userResetPassword(req, res);
});

authRouter.post("/verify", (req, res) => {
  authController.userVerify(req, res);
});

authRouter.get("/admin", jwtAuth, (req, res) => {
  authController.userAuth(req, res);
});

export default authRouter;
