import { Schema, model } from "mongoose";
import moment from "moment-timezone";

const desiredTimeZone = "America/Sao_Paulo"; // Fuso horário desejado

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
    conciliado: { type: Boolean, default: false },
    user_conciliado: { type: Schema.Types.ObjectId, ref: "Users" },
    createdAt: {
      type: Date,
      default: () => moment().tz(desiredTimeZone).format(),
    },
  },
  { timestamps: true }
);
// Middleware para ajustar o fuso horário antes de salvar
lancamentos.pre("save", function (next) {
  const currentDate = new Date();
  this.createdAt = moment(currentDate).tz(desiredTimeZone);
  this.updatedAt = moment(currentDate).tz(desiredTimeZone);
  next();
});

export default model("Lancamentos", lancamentos);
