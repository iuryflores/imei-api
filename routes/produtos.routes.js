import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Produto from "../models/Produtos.model.js";
import Buy from "../models/Buy.model.js";

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

router.get("/compraID/:compraID", async (req, res) => {
  const { compraID } = req.params;
  console.log(compraID);

  try {
    const data = await Buy.findById(compraID).populate("produto_id");
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "Produto não encontrado!" });
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

router.put("/add-price/:produto_id", async (req, res) => {
  const { produto_id } = req.params;
  const { value } = req.body;

  try {
    const addPrice = await Produto.findByIdAndUpdate(
      produto_id,
      {
        valorCompraDb: value,
      },
      { new: true }
    );
    console.log(addPrice);
    return res.status(201).json({ msg: "Foi adicionado o valor com sucesso!" });
  } catch (error) {
    return res.status(500).json({ msg: "Não foi possível alterar o produto." });
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
