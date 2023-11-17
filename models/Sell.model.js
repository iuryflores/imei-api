import { Schema, model } from "mongoose";

const OutrosProdutosSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Produtos" },
  qtd: { type: Number },
});

const Sells = new Schema(
  {
    imei_id: [{ type: Schema.Types.ObjectId, ref: "Imeis" }],
    outrosProdutos: [OutrosProdutosSchema],
    sell_number: { type: Number, required: true },
    cliente_id: { type: Schema.Types.ObjectId, ref: "Clients" },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    dateSell: { type: Date, default: Date.now },
    user_sell: { type: Schema.Types.ObjectId, ref: "Users" },
    conciliada: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("Sells", Sells);
