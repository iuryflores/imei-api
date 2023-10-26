import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Imei from "../models/Imei.model.js";
import Buy from "../models/Buy.model.js";
import CaixaDia from "../models/CaixaDia.model.js";
dotenv.config();

import moment from "moment-timezone";

const desiredTimeZone = "America/Sao_Paulo";

const router = Router();

//GET VENDAS DO CAIXA POR ID
router.get("/vendas/:caixa_id/", async (req, res, next) => {
  const { caixa_id } = req.params;
  console.log(caixa_id);
  try {
    const findedCaixa = await CaixaDia.findById(caixa_id)
      .populate("userAbertura")
      .populate("vendas");
    console.log(findedCaixa);
    return res.status(201).json(findedCaixa);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//VERIFICA OS CAIXAS ABERTOS
router.get("/todos-abertos/", async (req, res, next) => {
  try {
    const findedCaixa = await CaixaDia.find({
      status: true,
    })
      .populate("userAbertura")
      .populate("vendas");
    return res.status(201).json(findedCaixa);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//VERIFICA SE TEM CAIXA ABERTO
router.get("/aberto/:selectedDate", async (req, res, next) => {
  const { selectedDate } = req.params;

  try {
    const findedCaixa = await CaixaDia.findOne({
      data: selectedDate,
    }).populate({
      path: "vendas",
      populate: {
        path: "user_sell",
        model: "Users",
      },
    });
    console.log("caixa encontrado:", findedCaixa);
    return res.status(201).json(findedCaixa);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//ABRIR CAIXA
router.post("/abrir/", async (req, res, next) => {
  const { userId, selectedDate } = req.body;
  console.log(req.body);

  try {
    const abrirCaixa = await CaixaDia.create({
      data: selectedDate,
      userAbertura: userId,
      saldoInicial: 0,
    });

    return res.status(201).json(abrirCaixa);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

export default router;
// // Rota para fazer o fechamento do caixa
// app.post("/api/caixa/fechar", async (req, res) => {
//   try {
//     const { data } = req.body;

//     // Verifique se o caixa para essa data já foi fechado
//     const caixaFechado = await CaixaDiario.findOne({ data });

//     if (caixaFechado) {
//       return res.status(400).json({ message: "O caixa para este dia já foi fechado." });
//     }

//     // Agrupe todas as vendas para a data especificada
//     const vendasDoDia = await Venda.find({ data });

//     // Calcule o total das vendas do dia
//     const totalVendas = vendasDoDia.reduce((total, venda) => total + venda.valor, 0);

//     // Faça a conciliação do caixa
//     const saldoFinal = saldoInicial + totalVendas - despesas; // Você precisa calcular o saldo inicial e as despesas

//     // Crie o registro de caixa diário
//     const novoRegistro = new CaixaDiario({ data, saldoInicial, totalVendas, despesas, saldoFinal });
//     await novoRegistro.save();

//     res.status(201).json({ message: "Caixa fechado com sucesso" });
//   } catch (error) {
//     console.error("Erro ao fechar o caixa:", error);
//     res.status(500).json({ message: "Erro ao fechar o caixa" });
//   }
// });

// let caixasAbertos = {}; // Armazena o estado de abertura do caixa para cada dia

// // Rota para abrir o caixa para uma data específica
// router.post("/abrir", (req, res) => {
//   const { data, saldoInicial } = req.body;

//   // Verifique se o caixa já está aberto para a data especificada
//   if (caixasAbertos[data]) {
//     return res.status(400).json({ message: "O caixa para este dia já está aberto." });
//   }

//   // Registre a abertura do caixa para a data
//   caixasAbertos[data] = {
//     saldoInicial,
//     vendas: [],
//     despesas: 0,
//     fechado: false,
//   };

//   res.status(201).json({ message: "Caixa aberto com sucesso" });
// });

// // Endpoint para registrar uma venda no caixa
// router.post("/vendas/registrar", (req, res) => {
//   const { data, valor } = req.body;

//   if (!caixasAbertos[data]) {
//     return res.status(400).json({ message: "O caixa para este dia não está aberto." });
//   }

//   // Registre a venda no caixa para a data
//   caixasAbertos[data].vendas.push(valor);

//   res.status(201).json({ message: "Venda registrada com sucesso" });
// });

// // Endpoint para fechar o caixa
// router.post("/fechar", (req, res) => {
//   const { data } = req.body;

//   if (!caixasAbertos[data]) {
//     return res.status(400).json({ message: "O caixa para este dia não está aberto." });
//   }

//   if (caixasAbertos[data].fechado) {
//     return res.status(400).json({ message: "O caixa para este dia já está fechado." });
//   }

//   // Realize a lógica de fechamento do caixa aqui

//   // Marque o caixa como fechado
//   caixasAbertos[data].fechado = true;

//   res.status(200).json({ message: "Caixa fechado com sucesso" });
// });
