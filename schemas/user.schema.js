import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },

  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  orderSeries: {
    type: Number,
  },
  multiInvoiceSeries: {
    type: Number,
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
