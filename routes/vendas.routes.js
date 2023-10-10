import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Imei from "../models/Imei.model.js";
import Sell from "../models/Sell.model.js";
dotenv.config();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await Sell.find()
      .populate("cliente_id")
      .populate("imei_id")
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next();
  }
});

router.post("/new/", async (req, res, next) => {
  const { selectedCliente, imeiArray, valorVenda, userId } = req.body;
  let { sellDate } = req.body;

  if (!sellDate) {
    sellDate = new Date();
  }

  try {
    const newSell = await Sell.create({
      cliente_id: selectedCliente._id,
      price: valorVenda,
      imeiArray,
      dateSell: sellDate,
      user_sell: userId,
    });

    const { _id } = newSell;

    imeiArray.forEach(async (i) => {
      let imei_id = i._id;
      let imei_price = i.price;
      let imei_porcento = i.porcento;
      await Sell.findByIdAndUpdate(_id, {
        $push: { imei_id },
      });

      await Imei.findByIdAndUpdate(imei_id, {
        $push: {
          sell_id: _id,
          sell_price: imei_price,
          sell_porcento: imei_porcento,
        },
      });
    });
    return res.status(201).json({ msg: "Venda cadastrada com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
    next();
  }
});

export default router;
