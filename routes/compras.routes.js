import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Imei from "../models/Imei.model.js";
import Buy from "../models/Buy.model.js";
dotenv.config();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await Buy.find({ status: true })
      .populate("fornecedor_id")
      .populate("imei_id")
      .sort({ createdAt: -1 });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next();
  }
});

router.post("/new/", async (req, res, next) => {
  let newAudit;
  let newImei;
  let newAuditBuy;

  const { customerData, selectedItem, priceDb, imeiArray, userId } = req.body;

  try {
    //GET ULTIMA COMPRA NUMBER
    const last_buy_number = await Buy.find().sort({ buy_number: -1 }).limit(1);
    const buy_number = last_buy_number[0].buy_number;


    const next_buy_number = buy_number + 1;

    //CREATE COMPRA
    const newBuy = await Buy.create({
      fornecedor_id: selectedItem._id,
      dateBuy: customerData.dateBuy,
      description: customerData.description,
      price: priceDb,
      brand: customerData.brand,
      buy_number: next_buy_number || 1,
    });

    //CREATE IMEI
    for (let i = 0; i < imeiArray.length; i++) {
      newImei = await Imei.create({
        number: imeiArray[i].number,
        buy_id: newBuy._id,
      });

      //INSERT CADA IMEI NA COMPRA
      if (newImei) {
        await Buy.findByIdAndUpdate(newBuy._id, {
          $push: {
            imei_id: newImei._id,
          },
        });

        //CREATE AUDIT DE INSERT DE IMEI NA COMPRA
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

    //CREATE AUDIT DA COMPRA
    newAuditBuy = await Audit.create({
      descricao: "Cadastrou Compra",
      operacao: "CADASTRO",
      user_id: userId,
      buy_id: newBuy._id,
    });

    //CREATE PAYLOAD
    const payload = await Buy.findById(newBuy._id)
      .populate("fornecedor_id")
      .populate("imei_id");

    return res.status(201).json(payload);
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

//DELETA LOGICAMENTE A COMPRA
router.put("/delete/", async (req, res, next) => {
  const { compra_id } = req.body;

  try {
    const deleteCompra = await Buy.findByIdAndUpdate(
      compra_id,
      {
        status: false,
      },
      { new: true }
    );
    const { imei_id } = deleteCompra;

    console.log(imei_id);
    imei_id.forEach(async (element) => {
      await Imei.findByIdAndUpdate(element, { status: false }, { new: true });
    });

    return res.status(201).json({ msg: "Compra foi deletada!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const todos = await Buy.deleteMany();
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default router;
