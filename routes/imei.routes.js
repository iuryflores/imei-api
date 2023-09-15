import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Imei from "../models/Imei.model.js";
import Buy from "../models/Buy.model.js";
dotenv.config();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const todos = await Imei.find();
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/new/", async (req, res, next) => {
  const { customerData, selectedItem, imeiArray, userId } = req.body;
  let newAudit;
  let newAuditBuy;
  try {
    const newBuy = await Buy.create({
      fornecedor_id: selectedItem._id,
      dateBuy: customerData.dateBuy,
    });

    for (let i = 0; i < imeiArray.length; i++) {
      const newImei = await Imei.create({
        number: imeiArray[i],
        description: customerData.description,
        price: customerData.price,
        brand: customerData.brand,
        buy_id: newBuy._id,
      });

      await Buy.findByIdAndUpdate(newBuy._id, {
        $push: {
          imei_id: newImei._id,
        },
      });

      newAudit = await Audit.create({
        descricao: "Cadastrou Imei",
        operacao: "CADASTRO",
        user_id: userId,
        imei_id: newImei._id,
      });
    }
    newAuditBuy = await Audit.create({
      descricao: "Cadastrou Compra",
      operacao: "CADASTRO",
      user_id: userId,
      buy_id: newBuy._id,
    });
    return res.status(201).json({ msg: "Cadastrado com sucesso" });
  } catch (error) {
    if (!newAudit) {
      await Imei.findByIdAndDelete(newImei._id);
      return res.status(400).json({
        msg: "Não foi possível adicionar o Imei, contate o desenvolvedor do sistema.",
      });
    }
    return res.status(500).json(error);
  }
});

export default router;
