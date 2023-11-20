import { Router } from "express";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
import Imei from "../models/Imei.model.js";
import Sell from "../models/Sell.model.js";
import Lancamento from "../models/Lancamento.model.js";
import CaixaDia from "../models/CaixaDia.model.js";
import Produto from "../models/Produtos.model.js";

dotenv.config();

const router = Router();
//PEGA VENDAS
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
  const {
    sellDate,
    cliente_ID,
    imeiArray,
    selectedProducts,
    valorTotal,
    userData,
    dataPagamento,
    formaPagamento,
    idCaixa,
  } = req.body;

  let newSell;
  let next_sell_number;
  try {
    try {
      //GET LAST BUY NUMBER
      const last_sell_number = await Sell.findOne()
        .sort({ sell_number: -1 })
        .limit(1);

      if (last_sell_number !== null) {
        const sell_number = last_sell_number.sell_number;

        next_sell_number = sell_number + 1;
      } else {
        next_sell_number = 1;
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error });
    }
    //CRIA A VENDA
    try {
      newSell = await Sell.create({
        cliente_id: cliente_ID,
        price: valorTotal,
        imeiArray,
        dateSell: sellDate || new Date(),
        user_sell: userData.id,
        sell_number: next_sell_number,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error });
    }

    try {
      //INSERE IMEIS NA ARRAY DE IMEIS DA VENDA
      for (const i of imeiArray) {
        let imei_id = i._id;
        let imei_price = i.sellingPrice;
        let product_id = i.produto_id;
        const newImei = await Sell.findByIdAndUpdate(newSell._id, {
          $push: { imei_id },
        });
        //INSERE OS DADOS DA VENDA NO IMEI
        await Imei.findByIdAndUpdate(imei_id, {
          $push: {
            sell_id: newSell._id,
            sell_price: imei_price,
          },
        });

        //INDISPONIBILIZA O IMEI PARA OUTRA COMPRA
        await Imei.findByIdAndUpdate(imei_id, {
          $set: { status: "VENDIDO" },
        });

        const selectProdImei = await Produto.findById(product_id);
        await Produto.findByIdAndUpdate(selectProdImei._id, {
          $set: {
            qtd: selectProdImei.qtd - 1,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
    try {
      //INDISPONIBILIZA O PRODUTO
      for (const i of selectedProducts) {
        let produto_id = i._id;
        let produto_qtd = parseInt(i.quantity);

        const selectProd = await Produto.findById(produto_id);
        await Produto.findByIdAndUpdate(selectProd._id, {
          $set: {
            qtd: selectProd.qtd - produto_qtd,
          },
        });
        await Sell.findByIdAndUpdate(newSell._id, {
          $push: {
            outrosProdutos: [
              {
                product_id: produto_id,
                qtd: produto_qtd,
              },
            ],
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
    try {
      await CaixaDia.findOneAndUpdate(
        { _id: idCaixa },
        {
          $push: {
            vendas: newSell._id,
          },
        },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }

    //CRIA AUDITORIA
    try {
      const newAudit = await Audit.create({
        descricao: `Cadastrou Venda ${newSell.sell_number}`,
        entidade: "VENDAS",
        operacao: "CADASTRO",
        user_id: userData.id,
        reference_id: newSell._id,
      });
    } catch (error) {
      console.log(error);
    }

    //CADASTRA NO LANCAMENTOS DO CAIXA
    try {
      await Lancamento.create({
        description: `Registrou venda ${newSell.sell_number}`,
        valor: valorTotal,
        forma_pagamento: formaPagamento,
        data_pagamento: dataPagamento,
        tipo: "ENTRADA",
        caixa_id: idCaixa,
        origem_id: newSell._id,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error });
    }

    return res.status(201).json({ msg: "Venda cadastrada com sucesso" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro ao cadastrar a venda" });
  }
});

//DEVOLVE VENDA
router.put("/devolver", async (req, res, next) => {
  const { vendaID, userData } = req.body;

  const findLancamento = await Lancamento.findById(vendaID);

  const findVenda = await Sell.findById(findLancamento.origem_id);

  const findCaixa = await CaixaDia.findById(findLancamento.caixa_id);

  //ADICIONA QTD DOS IMEI
  try {
    for (const imeiObject of findVenda.imei_id) {
      const findIMEIData = await Imei.findById(imeiObject);

      const findProduto = await Produto.findById(findIMEIData.produto_id);

      const updateProduto = await Produto.findByIdAndUpdate(
        findIMEIData.produto_id,
        {
          qtd: findProduto.qtd + 1,
        },
        { new: true }
      );
      console.log(updateProduto);
    }
  } catch (error) {
    console.error(error);
  }
  //ADICIONA QTD DOS OUTROSPRODUTOS
  try {
    for (const outrosProdObject of findVenda.outrosProdutos) {
      // console.log(imeiObject);

      const findProduto = await Produto.findById(outrosProdObject.product_id);
      console.log(findProduto);

      console.log(findProduto.qtd);

      console.log(outrosProdObject.qtd);

      const updateProduto = await Produto.findByIdAndUpdate(
        findProduto._id,
        {
          qtd: findProduto.qtd + outrosProdObject.qtd,
        },
        { new: true }
      );
      console.log(updateProduto);
    }
  } catch (error) {
    console.error(error);
  }

  let [venda, lancamento, caixaDia] = "";

  // //SELL CHANGES
  try {
    venda = await Sell.findByIdAndUpdate(
      findVenda._id,
      {
        $set: {
          status: "DEVOLVIDO",
        },
      },
      {
        new: true,
      }
    );
  } catch (error) {
    console.log(error);
  }

  //LANCAMENTO CHANGES
  try {
    lancamento = await Lancamento.findByIdAndUpdate(
      findLancamento._id,
      {
        $set: {
          status: "DEVOLVIDO",
        },
      },
      {
        new: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
  //IMEI CHANGES
  try {
    for (const imeiObjectId of venda.imei_id) {
      Imei.findByIdAndUpdate(
        imeiObjectId,
        { status: "DISPONIVEL" },
        { new: true }
      )
        .then((updatedImei) => {
          // Aqui você pode realizar a ação desejada para cada IMEI
          console.log("IMEI encontrado:", updatedImei);
          // Realize sua ação aqui, como atualizar, deletar, etc.
        })
        .catch((error) => {
          console.error("Erro ao buscar IMEI:", error);
        });
    }
  } catch (error) {
    console.error(error);
  }
  //CAIXADIA CHANGES
  try {
    caixaDia = await CaixaDia.findByIdAndUpdate(
      findCaixa._id,
      {
        $pull: {
          vendas: findVenda._id,
        },
      },
      { new: true }
    )
      .then((updatedCaixaDia) => {
        console.log("CaixaDia atualizado:", updatedCaixaDia);
        // Realize suas ações aqui, se necessário
      })
      .catch((error) => {
        console.error("Erro ao atualizar CaixaDia:", error);
      });
  } catch (error) {
    console.log(error);
  }

  //AUDITORIA
  await Audit.create({
    descricao: `Venda ${findVenda.sell_number} devolvida`,
    entidade: "VENDAS",
    operacao: "DEVOLUÇÃO",
    user_id: userData.id,
    reference_id: findVenda._id,
  });
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
      descricao: `Deletou Venda ${deleteVenda.number}`,
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
