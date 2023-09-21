import { Schema, model } from "mongoose";

const imeis = new Schema(
  {
    number: { type: Number, required: true },
    status: { type: Boolean, default: true },
    buy_id: { type: Schema.Types.ObjectId, ref: "Buys" },
  },
  { timestamps: true }
);

export default model("Imeis", imeis);
