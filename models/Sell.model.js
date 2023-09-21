import { Schema, model } from "mongoose";

const sells = new Schema(
  {
    imei_id: [{ type: Schema.Types.ObjectId, ref: "Imeis" }],
    cliente_id: { type: Schema.Types.ObjectId, ref: "Clients" },
    price: { type: Number },
    status: { type: Boolean, default: true },
    dateSell: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("Sells", sells);
