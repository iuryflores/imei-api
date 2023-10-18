import { Schema, model } from "mongoose";

const CaixaDia = new Schema(
  {
    data: {
      type: String,
      required: true,
    },
    userAbertura: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    userFechamento: { type: Schema.Types.ObjectId, ref: "Users" },
    saldoInicial: {
      type: Number,
      required: true,
    },
    saldoFinal: {
      type: Number,
    },
    vendas: [{ type: Schema.Types.ObjectId, ref: "Sells" }],
  },
  { timestamps: true }
);
export default model("CaixaDia", CaixaDia);
