import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Buy from "../models/Buy.model.js";
import Imei from "../models/Imei.model.js";

dotenv.config();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const todos = await Imei.find({ status: "DISPONIVEL" }).populate({
      path: "buy_id",
      populate: {
        path: "produto_id",
        model: "Produtos",
      },
    });
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//VENDA
router.get("/:imei_number", async (req, res, next) => {
  const { imei_number } = req.params;

  try {
    const imeiVendido = await Imei.findOne({
      number: imei_number,
      status: { $ne: "DISPONIVEL" },
    });

    if (imeiVendido) {
      return res.status(403).json({ msg: "Imei já foi vendido!" });
    }

    const imei = await Imei.findOne({
      number: imei_number,
      status: "DISPONIVEL",
    }).populate({
      path: "buy_id",
      populate: {
        path: "produto_id",
        model: "Produtos",
      },
    });
    if (!imei) {
      return res.status(404).json({ msg: "IMEI não encontrado!" });
    }
    return res.status(200).json(imei);
  } catch (error) {
    console.error(error.message);
    next(error);
    return res.status(500).json({ msg: error.message });
  }
});
//COMPRA
router.get("/:imei_number/compra", async (req, res, next) => {
  const { imei_number } = req.params;

  try {
    const imei = await Imei.findOne({
      number: imei_number,
      status: "DISPONIVEL",
    });
    if (imei) {
      return res.status(404).json({ msg: "IMEI já encontrado no estoque." });
    }
    return res.status(200).json({ msg: "IMEI liberado para ser inserido!" });
  } catch (error) {
    console.error(error);
    next();
  }
});

export default router;
