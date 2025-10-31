import mongoose from "mongoose";

const multiBillSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: Number,
      required: true,
      unique: true,
    },
    orderIds: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one Order ID is required.",
      },
    },

    descHeading: { type: String, trim: true },

    billDate: {
      type: Date,
      required: true,
    },

    typeOfGST: {
      type: String,
      enum: ["CGST+SGST", "IGST"],
      required: true,
    },

    percentageOfGST: {
      type: Number,
      enum: [2.5, 5, 6.1, 9, 12, 18, 24],
      required: true,
    },

    // 💰 One global discount for the entire total
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    // 💰 Array of amounts per order
    billAmount: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "billAmount must be a non-empty array.",
      },
    },

    // 🧮 Subtotal before discount & GST
    totalBeforeDiscount: {
      type: Number,
      required: true,
      min: 0,
    },

    // 🧾 Final bill total after discount + GST
    billTotalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    clientGSTNumber: { type: String, trim: true },

    amountSummary: {
      type: mongoose.Schema.Types.Mixed,
    },

    billClientName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const MultiBillModel = mongoose.model("MultiBill", multiBillSchema);

export default MultiBillModel;
