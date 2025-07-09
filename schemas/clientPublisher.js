import mongoose from "mongoose";

const clientPublihserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      },
      category: {
        type: String,
        enum: ["client", "publisher"],
        required: true,
      },
});

const ClientPublisherModel = mongoose.model(
  "ClientPublisher",
  clientPublihserSchema
);

export default ClientPublisherModel;

