import { Router } from "express";
import Fornecedor from "../models/Fornecedor.model.js";
import * as dotenv from "dotenv";
dotenv.config();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const allFornecedores = await Fornecedor.find();
    return res.status(200).json(allFornecedores);
  } catch (error) {
    console.log(error);
    next();
  }
});

router.post("/new/", async (req, res, next) => {
  console.log(req.body);

  const { document, name, email, phone, type } = req.body.fornecedoresData;

  if (document === "" || name === "" || type === "") {
    return res.status(400).json({ msg: "Nome e CPF/CNPJ são obrigatórios!" });
  }

  const fornecedorExists = await Fornecedor.findOne({ document });

  if (fornecedorExists) {
    return res
      .status(400)
      .json({ msg: "Fornecedor(a) já foi cadadastrado(a)!" });
  }
  try {
    const newFornecedor = await Fornecedor.create({
      full_name: name,
      email,
      contact: phone,
      document,
      type,
    });
    const { _id } = newFornecedor;

    return res.status(201).json({ _id });
  } catch (error) {
    console.log(error);
    next();
  }
});

export default router;
