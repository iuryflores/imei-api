import { Schema, model } from "mongoose";

const imeis = new Schema(
  {
    number: { type: Number, required: true },
    status: { type: Boolean, default: true },
    buy_id: { type: Schema.Types.ObjectId, ref: "Buys" },
    buy_price: { type: Number },
    produto_id: { type: Schema.Types.ObjectId, ref: "Produtos" },
    sell_id: { type: Schema.Types.ObjectId, ref: "Sells" },
    sell_price: { type: Number },
    sell_porcento: { type: Number },
    serial: { type: String },
  },
  { timestamps: true }
);

export default model("Imeis", imeis);
