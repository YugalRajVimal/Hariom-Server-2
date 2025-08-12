import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    quotationFormNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    contactNo: {
      type: String,
      required: true,
      trim: true,
    },
    refNo: {
      type: String,
      trim: true,
    },
    paymentTerms: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    invoice: {
      type: String,
      trim: true,
    },
    customerId: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    dateOfInsertion: {
      type: String,
    },
    position: {
      type: String,
      trim: true,
    },
    publication: {
      type: String,
      required: true,
      trim: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    scheme: {
      type: String,
      trim: true,
    },
    remark: {
      type: String,
      trim: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    noOfAds: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    percentageOfGST: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;
