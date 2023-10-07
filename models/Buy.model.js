import { Schema, model } from "mongoose";

const buys = new Schema(
  {
    imei_id: [{ type: Schema.Types.ObjectId, ref: "Imeis" }],
    description: { type: String, required: true },
    brand: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isFinite, // Valida se é um número finito (double)
        message: "{VALUE} não é um número finito (double)",
      },
    },
    fornecedor_id: { type: Schema.Types.ObjectId, ref: "Fornecedor" },
    status: { type: Boolean, default: true },
    dateBuy: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("Buys", buys);
