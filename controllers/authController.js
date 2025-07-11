// import sendMail from "../config/nodeMailer.config.js";
import UserModel from "../schemas/user.schema.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../config/nodeMailer.config.js";

class AuthController {
  userVerify = async (req, res) => {
    var { email, otp, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Something went wrong. Try Again" });
    }

    if (!email || !otp || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    email = email.toLowerCase();
    otp = otp.trim();
    password = password.trim();

    //Check if email is valid
    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ message: "Email is invalid" });
    }

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Email" });
      }
      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      const currentTime = new Date(Date.now());
      if (user.otpExpires < currentTime) {
        return res.status(400).json({ message: "OTP Expired" });
      }

      user.password = await bcrypt.hash(password, 12);

      user.otp = null;
      user.otpExpires = null;

      await user.save();
      res.status(200).json({ message: "Account Verified Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  userSignIn = async (req, res) => {
    try {
      var { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      email = email.toLowerCase();
      password = password.trim();
      //Check if email is valid
      if (!email.includes("@") || !email.includes(".")) {
        return res.status(400).json({ message: "Email is invalid" });
      }

      //Validate the user
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Password / Email" });
      }

      // const isPasswordCorrect = password == user.password;
      const isPasswordCorrect = await bcrypt.compare(password, user.password);


      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid Password / Email" });
      }

      //Create 6 digit OTP using crypto
      //   const otp = crypto.randomInt(100000, 999999);
      //   const otpExpires = new Date(Date.now() + 5 * 60 * 1000); //5 minutes
      //   user.otp = otp;
      //   user.otpExpires = otpExpires;
      //   await user.save();
      // sendMail(email, "OTP Verification", `Your OTP is ${otp}`);
      //   console.log(`Your OTP is ${otp}`);
      //   return res.status(209).json({
      //     message: "Account not verified, OTP sent to your email. Verify Account",
      //   });

      //Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );

      res.status(200).json({ token, userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  userResetPassword = async (req, res) => {
    var { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.toLowerCase().trim();

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ message: "Email is invalid" });
    }

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Email" });
      }
      //Create 6 digit OTP using crypto
      const otp = crypto.randomInt(100000, 999999);
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); //5 minutes
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.password = null; // Clear password to force reset
      await user.save();

      sendMail(email, "OTP Verification", `Your OTP is ${otp}`);
      console.log(`Your OTP is ${otp}`);

      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  userAuth = async (req, res) => {
    try {
      res.status(200).json({ message: "Authorized", authenticated: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default AuthController;
