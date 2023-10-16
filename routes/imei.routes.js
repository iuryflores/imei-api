import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Imei from "../models/Imei.model.js";
import Buy from "../models/Buy.model.js";

dotenv.config();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const todos = await Imei.find({ status: true }).populate("buy_id");
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//VENDA
router.get("/:imei_number", async (req, res, next) => {
  const { imei_number } = req.params;

  try {
    const imei = await Imei.findOne({ number: imei_number }).populate("buy_id");
    if (!imei) {
      return res.status(404).json({ msg: "não encontrado" });
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
      status: true,
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
