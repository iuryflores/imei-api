import { Schema, model } from "mongoose";

const fornecedor = new Schema(
  {
    full_name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    document: { type: String, required: true },
    contact: { type: String },
    type: { type: String, required: true },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("Fornecedor", fornecedor);
