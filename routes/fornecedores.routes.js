import { Router } from "express";
import Fornecedor from "../models/Fornecedor.model.js";
import * as dotenv from "dotenv";
import Audit from "../models/Audit.model.js";
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

router.get("/busca/:term", async (req, res, next) => {
  const { term } = req.params;

  try {
    const filteredFornecedores = await Fornecedor.find({
      full_name: { $regex: new RegExp(term, "i") }, // Pesquisa case-insensitive
    }).sort({ full_name: 1 });
    return res.status(200).json(filteredFornecedores);
  } catch (error) {
    console.log(error);
  }
});

router.post("/new/", async (req, res, next) => {
  console.log(req.body);

  const { document, name, email, phone, type } = req.body.fornecedoresData;
  const { userId } = req.body;

  if (document === "" || name === "" || type === "") {
    return res.status(400).json({ msg: "Nome e CPF/CNPJ são obrigatórios!" });
  }

  const fornecedorExists = await Fornecedor.findOne({ document });

  if (fornecedorExists) {
    return res.status(400).json({ msg: "Fornecedor(a) já foi cadastrado(a)!" });
  }
  let newAudit;
  let newFornecedor;
  try {
    newFornecedor = await Fornecedor.create({
      full_name: name,
      email,
      contact: phone,
      document,
      type,
    });
    const { _id } = newFornecedor;

    newAudit = await Audit.create({
      descricao: "Cadastrou fornecedor",
      operacao: "CADASTRO",
      entidade: "FORNECEDORES",
      user_id: userId,
      reference_id: newFornecedor._id,
    });

    return res.status(201).json(newFornecedor);
  } catch (error) {
    if (!newAudit) {
      await Fornecedor.findByIdAndDelete(newFornecedor._id);
      return res.status(400).json({
        msg: "Não foi possível adicionar o fornecedor, contate o desenvolvedor do sistema.",
      });
    }
    console.log(error);
    next();
  }
});

export default router;
