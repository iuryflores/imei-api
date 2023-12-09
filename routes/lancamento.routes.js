import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Caixa from "../models/Caixa.model.js";
import User from "../models/User.model.js";
import Lancamentos from "../models/Lancamento.model.js";
dotenv.config();

import moment from "moment-timezone";

const desiredTimeZone = "America/Sao_Paulo";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const allLancamentos = await Lancamentos.find();
    return res.status(200).json(allLancamentos);
  } catch (error) {
    next(error);
  }
});

// router.get("/meu-caixa/:selectedDate/", async (req, res, next) => {
//   const { selectedDate } = req.params;
//   try {
//     // Obtém a data atual com o fuso horário desejado
//     const currentDateWithTimeZone = moment(selectedDate).tz(desiredTimeZone);

//     // Formata a data no formato ISO 8601 personalizado
//     const isoString = currentDateWithTimeZone.format(
//       "YYYY-MM-DDTHH:mm:ss.SSSZ"
//     );

//     const startOfDay = new Date(isoString);
//     startOfDay.setHours(0, 0, 0, 0); // Horas: 00:00:00

//     const endOfDay = new Date(isoString);
//     endOfDay.setHours(23, 59, 59, 999); // Horas: 23:59:59.999

//     const filteredLancamentos = await Lancamentos.find({
//       createdAt: {
//         $gte: startOfDay,
//         $lte: endOfDay,
//       },
//     })
//       .populate({
//         path: "origem_id",
//         populate: {
//           path: "cliente_id",
//           model: "Clients",
//         },
//       })
//       .populate({
//         path: "origem_id",
//         populate: {
//           path: "user_sell",
//           model: "Users",
//         },
//       })
//       .sort({ createdAt: -1 });
//     return res.status(200).json(filteredLancamentos);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/meu-caixa-id/:caixa_id/", async (req, res, next) => {
  const { caixa_id } = req.params;
  console.log("caixa-id", caixa_id);
  if (caixa_id) {
    try {
      const filteredLancamentos = await Lancamentos.find({
        caixa_id: caixa_id,
      })
        .populate({
          path: "origem_id",
          populate: {
            path: "cliente_id",
            model: "Clients",
          },
        })
        .populate({
          path: "origem_id",
          populate: {
            path: "user_sell",
            model: "Users",
          },
        })
        .sort({ createdAt: -1 });
      return res.status(200).json(filteredLancamentos);
    } catch (error) {
      return res.status(404).json({ msg: "Nenhum caixa aberto hoje;" });
    }
  }
});
export default router;
