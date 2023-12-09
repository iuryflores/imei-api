import { Schema, SchemaType, model } from "mongoose";

const users = new Schema(
  {
    full_name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    cpf: { type: String, required: true },
    passwordHash: { type: String, required: true },
    status: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    caixa_id: { type: Schema.Types.ObjectId, ref: "Caixas" },
  },
  { timestamps: true }
);

export default model("Users", users);
