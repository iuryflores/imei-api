import { Schema, model } from "mongoose";
import moment from "moment-timezone";

const desiredTimeZone = "America/Sao_Paulo"; // Fuso horário desejado

const lancamentos = new Schema(
  {
    description: { type: String, required: true },
    valor: { type: Number, required: true },
    forma_pagamento: { type: String, required: true },
    data_pagamento: { type: Date },
    data_vencimento: { type: Date },
    tipo: { type: String, required: true },
    caixa_id: { type: Schema.Types.ObjectId, ref: "CaixaDia", required: true },
    origem_id: { type: Schema.Types.ObjectId, ref: "Sells", required: true },
    status: { type: String, required: true, default: "ATIVO" },
    conciliado: { type: Boolean, default: false },
    user_conciliado: { type: Schema.Types.ObjectId, ref: "Users" },
    data_conciliacao: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: () => moment().tz(desiredTimeZone).format(),
    },
  },
  { timestamps: true }
);

export default model("Lancamentos", lancamentos);
