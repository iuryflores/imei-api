import { Schema, model } from "mongoose";

const lancamentos = new Schema(
  {
    description: { type: String, require: true },
    valor: { type: Number, require: true },
    forma_pagamento: { type: String, require: true },
    data_pagamento: { type: Date, default: Date.now },
    data_vencimento: { type: Date, defaul: Date.now },
    tipo: { type: String, require: true },
    caixa_id: { type: Schema.Types.ObjectId, ref: "Caixas", require: true },
    origem_id: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export default model("Lancamentos", lancamentos);
