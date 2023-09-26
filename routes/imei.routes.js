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
      description: customerData.description,
      price: customerData.price,
      brand: customerData.brand,
    });

    for (let i = 0; i < imeiArray.length; i++) {
      let newImei = await Imei.create({
        number: imeiArray[i],
        buy_id: newBuy._id,
      });
      if (newImei) {
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
      } else {
        return res.status(500).json({ msg: "Nao foi possivel cadastrar imei" });
      }
    }

    const registro = await Buy.findById(newBuy._id)
      .populate("fornecedor_id")
      .populate("imei_id");

    newAuditBuy = await Audit.create({
      descricao: "Cadastrou Compra",
      operacao: "CADASTRO",
      user_id: userId,
      buy_id: newBuy._id,
    });
    return res.status(201).json(registro);
  } catch (error) {
    if (!newAudit) {
      await Imei.findByIdAndDelete(newImei._id);
      return res.status(400).json({
        msg: "Não foi possível adicionar o Imei, contate o desenvolvedor do sistema.",
      });
    }
    console.log(error);
    return res.status(500).json(error);
  }
});

export default router;
