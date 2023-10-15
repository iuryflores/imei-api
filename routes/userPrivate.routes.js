import { Router } from "express";
import User from "../models/User.model.js";
import Audit from "../models/Audit.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado/ativado!" });
    }
    const payload = {
      id: user._id,
      full_name: user.full_name,
      admin: user.admin,
      email: user.email,
      cpf: user.cpf,
      caixa_id: user.caixa_id,
    };

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}); //EDITA USER POR ID
router.put("/edit/", async (req, res, next) => {
  const { userDataEdit, userId } = req.body;
  console.log(userDataEdit);
  try {
    //Check if is a valid email
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    if (!emailRegex.test(userDataEdit.email)) {
      return res.status(400).json({ msg: "Seu email não é válido." });
    }
    if (userDataEdit.password) {
      //Generate passwordHash
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(userDataEdit.password, salt);

      const alteracaoComSenha = await User.findByIdAndUpdate(
        { _id: userDataEdit.id },
        {
          full_name: userDataEdit.name,
          status: userDataEdit.status,
          email: userDataEdit.email,
          cpf: userDataEdit.cpf,
          passwordHash: passwordHash,
          caixa_id: userDataEdit.caixa_id,
        },
        { new: true }
      );
      if (!alteracaoComSenha) {
        return res
          .status(500)
          .json({ msg: "Não foi possível alterar o Usuário" });
      }
    } else {
      const alteracao = await User.findByIdAndUpdate(
        { _id: userDataEdit.id },
        {
          full_name: userDataEdit.name,
          status: userDataEdit.status,
          email: userDataEdit.email,
          cpf: userDataEdit.cpf,
          caixa_id: userDataEdit.caixa_id,
        },
        { new: true }
      );
      if (!alteracao) {
        return res
          .status(500)
          .json({ msg: "Não foi possível alterar o Usuário" });
      }
    }

    //CREATE AUDIT
    const newAudit = await Audit.create({
      descricao: `Alterou Usuário ${userDataEdit.full_name}`,
      operacao: "EDITA",
      entidade: "USUÁRIOS",
      reference_id: userDataEdit.id,
      user_id: userId,
    });
    if (!newAudit) {
      return res.status(500).json({
        msg: "Não foi possível cadastrar autoria de alteração do Caixa",
      });
    }

    return res.status(200).json({ msg: "Caixa alterado com sucesso!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
