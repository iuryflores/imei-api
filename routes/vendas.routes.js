import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Imei from "../models/Imei.model.js";
import Sell from "../models/Sell.model.js";
dotenv.config();

const router = Router();
//EPGA VENDAS
router.get("/", async (req, res, next) => {
  try {
    const data = await Sell.find({ status: true })
      .populate("cliente_id")
      .populate("imei_id");
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next();
  }
});
//CADASTRA VENDA
router.post("/new/", async (req, res, next) => {
  let newAudit;

  const { selectedCliente, imeiArray, valorVenda, userId } = req.body;
  let { sellDate } = req.body;

  if (!sellDate) {
    sellDate = new Date();
  }

  try {
    const newSell = await Sell.create({
      cliente_id: selectedCliente._id,
      price: valorVenda,
      imeiArray,
      dateSell: sellDate,
      user_sell: userId,
    });

    const { _id } = newSell;

    imeiArray.forEach(async (i) => {
      let imei_id = i._id;
      let imei_price = i.price;
      let imei_porcento = i.porcento;
      await Sell.findByIdAndUpdate(_id, {
        $set: { imei_id },
      });

      await Imei.findByIdAndUpdate(imei_id, {
        $set: {
          sell_id: _id,
          sell_price: imei_price,
          sell_porcento: imei_porcento,
        },
      });
      await Imei.findByIdAndUpdate(imei_id, {
        $set: { status: false },
      });
    });

    newAudit = await Audit.create({
      descricao: "Cadastrou Venda",
      operacao: "CADASTRO",
      user_id: userId,
      sell_id: newSell._id,
    });

    return res.status(201).json({ msg: "Venda cadastrada com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
    next();
  }
});

//DELETA LOGICAMENTE A VENDA
router.put("/delete/", async (req, res, next) => {
  const { venda_id, userId } = req.body;

  try {
    const deleteVenda = await Sell.findByIdAndUpdate(
      venda_id,
      {
        status: false,
      },
      { new: true }
    );
    const { imei_id } = deleteVenda;
    console.log(imei_id);
    imei_id.forEach(async (element) => {
      await Imei.findByIdAndUpdate(element, {
        $set: {
          status: true,
          sell_id: null,
          sell_porcento: null,
          sell_price: null,
        },
      });
    });

    const newAudit = await Audit.create({
      descricao: "Deletou Venda",
      operacao: "DELETE",
      user_id: userId,
      sell_id: venda_id,
    });
    if (newAudit) {
      return res.status(201).json({ msg: "Venda foi deletada!" });
    } else {
      try {
        // Reverter a atualização da venda
        await Sell.findByIdAndUpdate(
          venda_id,
          {
            status: true,
          },
          { new: true }
        );

        // Reverter as atualizações de status para imei_id
        const imeiPromises = imei_id.map(async (element) => {
          await Imei.findByIdAndUpdate(element, { $set: { status: false } });
        });

        await Promise.all(imeiPromises);

        return res
          .status(500)
          .json({ msg: "Ocorreu um erro. As alterações foram desfeitas." });
      } catch (error) {
        return res
          .status(500)
          .json({ msg: "Ocorreu um erro ao desfazer as alterações." });
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
