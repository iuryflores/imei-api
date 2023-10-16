import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Caixa from "../models/Caixa.model.js";
import User from "../models/User.model.js";
import Lancamentos from "../models/Lancamento.model.js";
dotenv.config();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const allLancamentos = await Lancamentos.find();
    return res.status(200).json(allLancamentos);
  } catch (error) {
    next(error);
  }
});

router.get("/meu-caixa/:selectedDate/:userId", async (req, res, next) => {
  const { selectedDate, caixaId } = req.params;
  console.log(req.params);
  try {
    // Convert the selectedDate to a JavaScript Date object
    const parsedDate = new Date(selectedDate);

    // Assuming Lancamentos has userId and date fields, we filter by them
    const filteredLancamentos = await Lancamentos.find({
      caixa_id: caixaId,
      createdAt: parsedDate,
    });

    return res.status(200).json(filteredLancamentos);
  } catch (error) {
    next(error);
  }
});
export default router;
