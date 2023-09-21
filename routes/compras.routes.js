import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Imei from "../models/Imei.model.js";
import Buy from "../models/Buy.model.js";
dotenv.config();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await Buy.find().populate("fornecedor_id").populate("imei_id");
    console.log(data)
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
