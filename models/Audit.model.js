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
    entidade: { type: String, require: true },
    reference_id: { type: Schema.Types.ObjectId },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);
export default model("Audit", AuditSchema);
