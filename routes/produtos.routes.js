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
  const { description, brand, qtd } = body.formData;

  const { valorCompraDb, valorVendaDb, hasImei } = req.body;

  try {
    const newProduto = await Produto.create({
      description,
      brand,
      qtd,
      hasImei,
      valorCompraDb,
      valorVendaDb,
    });
    return res.status(201).json(newProduto);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//BUSCA PRODUTO
router.get("/busca/:term", async (req, res, next) => {
  const { term } = req.params;

  try {
    const filteredProdutos = await Produto.find({
      description: { $regex: new RegExp(term, "i") }, // Pesquisa case-insensitive
    }).sort({ description: 1 });
    if (filteredProdutos.length === 0) {
      return res.status(404).json({ msg: "Nenhum produto encontrado" });
    }
    return res.status(200).json(filteredProdutos);
  } catch (error) {
    next();
    console.log(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const deletedProduto = await Produto.findByIdAndRemove(id);
    return res.status(201).json({ msg: "Produto deletado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ msg: "Não foi possível deletar o produto." });
  }
});

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  console.log(id, description);
  try {
    const editProduto = await Produto.findByIdAndUpdate(id, {
      description: description,
    });
    return res.status(201).json({ msg: "Produto alterado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ msg: "Não foi possível alterar o produto." });
  }
});

export default router;
