import { Schema, model } from "mongoose";

const imeis = new Schema(
  {
    number: { type: Number, required: true },
    description: { type: String, required: true },
    price: { type: Number },
    brand: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model("Imeis", imeis);
