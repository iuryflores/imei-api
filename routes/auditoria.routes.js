import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Imei from "../models/Imei.model.js";
import Buy from "../models/Buy.model.js";
dotenv.config();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await Audit.find()
      .populate("fornecedor_id")
      .populate("imei_id")
      .populate("sell_id")
      .populate({
        path: "buy_id",
        populate: {
          path: "fornecedor_id",
        },
      })
      .populate("cliente_id")
      .populate("user_id_changed")
      .populate("user_id").sort({createdAt: -1});
  
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next();
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
