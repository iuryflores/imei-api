import { Schema, model } from "mongoose";

const caixaDiario = new Schema(
  {
    data: {
      type: Date,
      required: true,
    },
    saldoInicial: {
      type: Number,
      required: true,
    },
    vendas: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
export default model("CaixaDiario", caixaDiario);
