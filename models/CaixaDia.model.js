import { Schema, model } from "mongoose";
import moment from "moment-timezone";

const desiredTimeZone = "America/Sao_Paulo";

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
    status: { type: Boolean, default: false },
    vendas: [{ type: Schema.Types.ObjectId, ref: "Sells" }],
    createdAt: {
      type: Date,
      default: () => moment().tz(desiredTimeZone).format(),
    },
  },
  { timestamps: true }
);
export default model("CaixaDia", CaixaDia);
