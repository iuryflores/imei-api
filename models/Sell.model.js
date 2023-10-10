import { Schema, model } from "mongoose";

const sells = new Schema(
  {
    imei_id: [{ type: Schema.Types.ObjectId, ref: "Imeis", require: true }],
    cliente_id: { type: Schema.Types.ObjectId, ref: "Clients" },
    price: { type: Number, require: true },
    status: { type: Boolean, default: true },
    dateSell: { type: Date, default: Date.now },
    user_sell: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

export default model("Sells", sells);
