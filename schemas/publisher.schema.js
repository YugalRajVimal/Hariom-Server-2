import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema({
  publisherName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  }
});

const PublisherModel = mongoose.model("Publisher", publisherSchema);

export default PublisherModel;
