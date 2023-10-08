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

let newAudit;
let newImei;
router.post("/new/", async (req, res, next) => {
  const { customerData, selectedItem, priceDb, imeiArray, userId } = req.body;
  let newAuditBuy;
  try {
    const newBuy = await Buy.create({
      fornecedor_id: selectedItem._id,
      dateBuy: customerData.dateBuy,
      description: customerData.description,
      price: priceDb,
      brand: customerData.brand,
    });

    for (let i = 0; i < imeiArray.length; i++) {
      newImei = await Imei.create({
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
    if (!newAudit && newImei) {
      await Imei.findByIdAndDelete(newImei._id);
      return res.status(400).json({
        msg: "Não foi possível adicionar o Imei, contate o desenvolvedor do sistema.",
      });
    }
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get("/:imei_number", async (req, res) => {
  const { imei_number } = req.params;

  try {
    const imei = await Imei.findOne({ number: imei_number }).populate("buy_id");

    if (!imei) {
      return res.status(404).json({ msg: "IMEI não encontrado no estoque." });
    }

    // Retorna os detalhes do IMEI e as compras relacionadas
    return res.status(200).json(imei);
  } catch (error) {
    console.error(error);
    next()
  }
});

export default router;
