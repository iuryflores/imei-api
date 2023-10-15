import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Caixa from "../models/Caixa.model.js";
import User from "../models/User.model.js";
dotenv.config();

const router = Router();
//PEGA CAIXAS
router.get("/", async (req, res, next) => {
  try {
    const data = await Caixa.find();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
//PEGA CAIXAS ATIVOS
router.get("/ativos/", async (req, res, next) => {
  try {
    const data = await Caixa.find({ status: true });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
//CREATE CAIXA
router.post("/new/", async (req, res, next) => {
  let newAudit;
  let newCaixa;

  const { caixaData, userId } = req.body;

  try {
    //CREATE CAIXA
    newCaixa = await Caixa.create({
      name: caixaData.nome,
      saldo_inicial: caixaData.saldoInicial,
      dia_inicio: caixaData.dataInicio,
    });

    //CREATE AUDIT
    newAudit = await Audit.create({
      descricao: "Cadastrou Caixa",
      operacao: "CADASTRO",
      entidade: "CAIXAS",
      user_id: userId,
      reference_id: newCaixa._id,
    });

    return res.status(201).json(newCaixa);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "Não foi possível cadastrar o caixa, contate o desenvolvedor do sistema.",
    });
  }
});
//PEGA CAIXA POR ID
router.get("/edit/:caixa_id", async (req, res, next) => {
  const { caixa_id } = req.params;
  try {
    const caixa = await Caixa.findById(caixa_id);

    if (!caixa) {
      return res.status(404).json({ msg: "Caixa não encontrado/ativado!" });
    }
    const payload = {
      id: caixa._id,
      name: caixa.name,
      status: caixa.status,
      data_inicio: caixa.dia_inicio,
      saldo_inicial: caixa.saldo_inicial,
    };

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
});
//ALTERA CAIXA POR ID
router.put("/edit/", async (req, res, next) => {
  const { caixaDataEdit, userId } = req.body;

  try {
    await Caixa.findByIdAndUpdate(
      { _id: caixaDataEdit.id },
      {
        name: caixaDataEdit.name,
        status: caixaDataEdit.status,
        data_inicio: caixaDataEdit.dia_inicio,
        saldo_inicial: caixaDataEdit.saldo_inicial,
      },
      { new: true }
    );
    try {
      await User.findOneAndUpdate(
        {
          caixa_id: caixaDataEdit.id,
        },
        {
          caixa_id: null,
        },
        { new: true }
      );
    } catch (error) {
      next(error);
    }

    try {
      //CREATE AUDIT
      const newAudit = await Audit.create({
        descricao: `Alterou Caixa`,
        operacao: "ALTERA",
        entidade: "CAIXAS",
        reference_id: caixa._id,
        user_id: userId,
      });
    } catch (error) {
      next(error);
    }

    return res.status(200).json({ msg: "Caixa alterado com sucesso!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// //DELETA LOGICAMENTE
// router.put("/delete/", async (req, res, next) => {
//   const { compra_id } = req.body;

//   try {
//     const deleteCompra = await Buy.findByIdAndUpdate(
//       compra_id,
//       {
//         status: false,
//       },
//       { new: true }
//     );
//     const { imei_id } = deleteCompra;

//     console.log(imei_id);
//     imei_id.forEach(async (element) => {
//       await Imei.findByIdAndUpdate(element, { status: false }, { new: true });
//     });

//     return res.status(201).json({ msg: "Compra foi deletada!" });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });
export default router;
