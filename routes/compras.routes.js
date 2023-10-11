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
