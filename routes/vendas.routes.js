import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Imei from "../models/Imei.model.js";
import Sell from "../models/Sell.model.js";
import Lancamento from "../models/Lancamento.model.js";
dotenv.config();

const router = Router();
//EPGA VENDAS
router.get("/", async (req, res, next) => {
  try {
    const data = await Sell.find({ status: true })
      .populate("cliente_id")
      .populate("imei_id")
      .populate("user_sell");
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next();
  }
});
//CADASTRA VENDA
router.post("/new/", async (req, res, next) => {
  let newAudit;

  const {
    sellDate,
    selectedCliente,
    imeiArray,
    valorVenda,
    userId,
    userData,
    dataPagamento,
    formaPagamento,
  } = req.body;

  if (!sellDate) {
    sellDate = new Date();
  }

  try {
    //GET ULTIMA COMPRA NUMBER
    const last_sell_number = await Sell.findOne()
      .sort({ sell_number: -1 })
      .limit(1);

    let next_sell_number;
    if (last_sell_number !== null) {
      const sell_number = last_sell_number.sell_number;

      next_sell_number = sell_number + 1;
    } else {
      next_sell_number = 1;
    }
    let newSell;
    try {
      newSell = await Sell.create({
        cliente_id: selectedCliente._id,
        price: valorVenda,
        imeiArray,
        dateSell: sellDate,
        user_sell: userId,
        sell_number: next_sell_number,
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
    } catch (error) {
      console.log(error);
    }
    try {
      newAudit = await Audit.create({
        descricao: `Cadastrou Venda ${newSell.sell_number}`,
        operacao: "CADASTRO",
        user_id: userId,
        reference_id: newSell._id,
      });
    } catch (error) {
      console.log(error);
    }

    try {
      //CADASTRA NO CAIXA A VENDA
      await Lancamento.create({
        description: `Registrou venda ${newSell.sell_number}`,
        valor: valorVenda,
        forma_pagamento: formaPagamento,
        data_pagamento: dataPagamento,
        tipo: "SAÍDA",
        caixa_id: userData.caixa_id,
        origem_id: newSell._id,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error });
    }

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
      descricao: `◊Deletou Venda ${deleteVenda.number}`,
      operacao: "DELETE",
      entidade: "VENDAS",
      user_id: userId,
      reference_id: venda_id,
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
