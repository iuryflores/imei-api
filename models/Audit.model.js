import { Schema, model } from "mongoose";

const AuditSchema = new Schema(
  {
    descricao: {
      type: String,
      required: true,
    },
    operacao: {
      type: String,
      required: true,
    },
    buy_id: { type: Schema.Types.ObjectId, ref: "Buys" },
    sell_id: { type: Schema.Types.ObjectId, ref: "Sells" },
    imei_id: {
      type: Schema.Types.ObjectId,
      ref: "Imeis",
    },
    fornecedor_id: { type: Schema.Types.ObjectId, ref: "Fornecedor" },
    cliente_id: { type: Schema.Types.ObjectId, ref: "Clients" },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);
export default model("Audit", AuditSchema);
