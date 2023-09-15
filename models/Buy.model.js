import { Schema, model } from "mongoose";

const buys = new Schema(
  {
    imei_id: [{ type: Schema.Types.ObjectId, ref: "Imeis" }],
    fornecedor_id: { type: Schema.Types.ObjectId, ref: "Fornecedores" },
    status: { type: Boolean, default: true },
    dateBuy: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("Buys", buys);
