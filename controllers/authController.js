// import sendMail from "../config/nodeMailer.config.js";
import UserModel from "../schemas/user.schema.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  userVerify = async (req, res) => {
    var { email, otp, password, role } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Something went wrong. Try Again" });
    }

    if (!email || !otp || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    email = email.toLowerCase();
    otp = otp.trim();
    password = password.trim();
    role = role.toLowerCase().trim();

    if (role !== "customer" && role !== "seller") {
      return res.status(400).json({ message: "Invalid Role" });
    }

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
      if (role === "seller") {
        user.verifiedSeller = true;
        user.sellerPassword = await bcrypt.hash(password, 12);
      }
      if (role === "customer") {
        user.verifiedBuyer = true;
        user.buyerPassword = await bcrypt.hash(password, 12);
      }

      user.otp = null;
      user.otpExpires = null;
      if (!user.role.includes(role)) {
        if (role === "seller" && user.verifiedSeller) {
          user.role.push(role);
        }
        if (role === "customer" && user.verifiedBuyer) {
          user.role.push(role);
        }
      }
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

      const isPasswordCorrect = password == user.password;

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
    var { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.toLowerCase().trim();
    role = role.toLowerCase().trim();

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ message: "Email is invalid" });
    }
    if (role !== "customer" && role !== "seller") {
      return res.status(400).json({ message: "Invalid Role" });
    }

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Email" });
      }
      if (!user.role.includes(role)) {
        return res.status(400).json({ message: "Invalid Role" });
      }
      //Create 6 digit OTP using crypto
      const otp = crypto.randomInt(100000, 999999);
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); //5 minutes
      user.otp = otp;
      user.otpExpires = otpExpires;
      if (role === "seller") {
        user.sellerPassword = null;
      }
      if (role === "customer") {
        user.buyerPassword = null;
      }
      await user.save();

      sendMail(email, "OTP Verification", `Your OTP is ${otp}`);
      console.log(`Your OTP is ${otp}`);

      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
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
