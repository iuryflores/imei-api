import { Schema, model } from "mongoose";

const caixas = new Schema(
  {
    status: { type: Boolean, default: true },
    name: { type: String, require: true },
    saldo_inicial: { type: Number, default: 0 },
    dia_inicio: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("Caixas", caixas);
