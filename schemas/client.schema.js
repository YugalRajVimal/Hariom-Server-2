import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const ClientModel = mongoose.model("Client", clientSchema);

export default ClientModel;
