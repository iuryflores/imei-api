import { Schema, model } from "mongoose";

const caixas = new Schema(
  {
    status: { type: Boolean, default: true },
    name: { type: String, require: true },
    saldo_inicial: { type: Number, default: 0 },
    dia_inicio: { type: String, require: true },
    user_id: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

export default model("Caixas", caixas);
