import { Schema, model } from "mongoose";

const produtos = new Schema(
  {
    status: { type: Boolean, default: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    qtd: { type: Number, default: 0 },
    valorCompraDb: { type: Number },
    valorVendaDb: { type: Number },
    hasImei: { type: String },
  },
  { timestamps: true }
);
// Adiciona o índice único para o campo 'description'
produtos.index({ description: 1 }, { unique: true, dropDups: true });

export default model("Produtos", produtos);
