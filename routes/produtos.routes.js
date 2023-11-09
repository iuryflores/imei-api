import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Produto from "../models/Produtos.model.js";

dotenv.config();

const router = Router();

//PEGA OS PRODUTOS
router.get("/", async (req, res, next) => {
  try {
    const allProdutos = await Produto.find({ status: true });
    return res.status(200).json(allProdutos);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//CADASTRA PRODUTOS
router.post("/new/", async (req, res, next) => {
  console.log(req.body);
  const { body } = req;
  const { description, brand } = body.formData;
  console.log(description, brand);

  try {
    const newProduto = await Produto.create({
      description,
      brand,
    });
    return res.status(201).json(newProduto);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

export default router;
