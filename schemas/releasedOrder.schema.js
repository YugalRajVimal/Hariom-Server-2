import mongoose from "mongoose";

const roSchema = new mongoose.Schema(
  {
    roNo: {
      type: String,
      required: true,
      unique: true,
    },
    quotationFormNo:{
      type: String,
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    publicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
      required: true,
    },
    publicationName: {
      type: String,
      required: true,
    },
    insertionDate: {
      type: Date,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    noOfAds: {
      type: Number,
      default: 1,
    },
    referenceNo: {
      type: String,
      required: true,
    },
    hui: {
      type: String,
      enum: ["B/W", "Color"],
      default: "B/W",
    },
    schemaMaterial: {
      type: String,
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
    rate: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    agency1: {
      type: Number,
      default: 0,
    },
    agency2: {
      type: Number,
      default: 0,
    },
    agency3: {
      type: Number,
      default: 0,
    },
    totalCommission: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    remark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const RoModel = mongoose.model("ReleasedOrder", roSchema);

export default RoModel;
