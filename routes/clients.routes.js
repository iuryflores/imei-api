import { Router } from "express";
import Clients from "../models/Client.model.js";
import * as dotenv from "dotenv";
dotenv.config();

const router = Router();


router.get("/", async (req, res, next) => {
  try {
    const allClientes = await Clients.find();
    return res.status(200).json(allClientes);
  } catch (error) {
    console.log(error);
    next();
  }
});

export default router