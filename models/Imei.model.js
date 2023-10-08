import { Schema, model } from "mongoose";

const imeis = new Schema(
  {
    number: { type: Number, required: true },
    status: { type: Boolean, default: true },
    buy_id: { type: Schema.Types.ObjectId, ref: "Buys" },
    sell_id: { type: Schema.Types.ObjectId, ref: "Sells" },
    buy_price: { type: Number },
    sell_price: { type: Number },
  },
  { timestamps: true }
);

export default model("Imeis", imeis);
