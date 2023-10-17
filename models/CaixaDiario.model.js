import { Schema, model } from "mongoose";

const caixaDiario = new Schema(
  {
    data: {
      type: Date,
      required: true,
    },
    userAbertura: { type: Schema.Types.ObjectId, ref: "Users" },
    userFechamento: { type: Schema.Types.ObjectId, ref: "Users" },
    saldoInicial: {
      type: Number,
      required: true,
    },
    saldoFinal: {
      type: Number,
      required: true,
    },
    vendas: [{ type: Schema.Types.ObjectId, ref: "Sells" }],
  },
  { timestamps: true }
);
export default model("CaixaDiario", caixaDiario);
