import { Router } from "express";
import Clients from "../models/Client.model.js";
import Audit from "../models/Audit.model.js";
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

router.get("/busca/:term", async (req, res, next) => {
  const { term } = req.params;

  try {
    const filteredCliente = await Clients.find({
      full_name: { $regex: new RegExp(term, "i") }, // Pesquisa case-insensitive
    }).sort({ full_name: 1 });
    return res.status(200).json(filteredCliente);
  } catch (error) {
    console.log(error);
  }
});

router.post("/new/", async (req, res, next) => {
  console.log(req.body);

  const { document, name, email, phone, type } = req.body.customerData;
  const { userId } = req.body;

  if (document === "" || name === "" || type === "") {
    return res.status(400).json({ msg: "Nome e CPF/CNPJ são obrigatórios!" });
  }

  const ClientExists = await Clients.findOne({ document });

  if (ClientExists) {
    return res.status(400).json({ msg: "Cliente já foi cadastrado(a)!" });
  }
  let newAudit;
  let newCliente;
  try {
    newCliente = await Clients.create({
      full_name: name,
      email,
      contact: phone,
      document,
      type,
    });
    const { _id } = newCliente;
    console.log(newCliente);
    if (newCliente) {
      newAudit = await Audit.create({
        descricao: `Cadastrou cliente ${newCliente.full_name}`,
        operacao: "CADASTRO",
        entidade: "CLIENTES",
        user_id: userId,
        reference_id: newCliente._id,
      });
    }
    return res.status(201).json(newCliente);
  } catch (error) {
    console.log(error);
    if (!newAudit) {
      await Clients.findByIdAndDelete(newCliente._id);
      return res.status(400).json({
        msg: "Não foi possível adicionar o cliente, contate o desenvolvedor do sistema.",
      });
    }

    next();
  }
});

export default router;
