import { Schema, model } from "mongoose";

const produtos = new Schema(
  {
    status: { type: Boolean, default: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    qtd: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model("Produtos", produtos);
