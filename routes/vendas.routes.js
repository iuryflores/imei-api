import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Imei from "../models/Imei.model.js";
import Sell from "../models/Sell.model.js";
dotenv.config();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await Sell.find().populate("client_id").populate("imei_id");
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next();
  }
});

router.post("/new/", async (req, res, next) => {
  const { body } = req;
  console.log(body);
  try {
  } catch (error) {}
});

export default router;
