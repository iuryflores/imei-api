import { Router } from "express";
import User from "../models/User.model.js";
import Audit from "../models/Audit.model.js";
import * as dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

//Create User
router.post("/user/auth/signup", async (req, res, next) => {
  //Get data from body
  let { newUsername, email, confirmPassword, cpf } = req.body;

  //Check if all fields are filled
  if (!newUsername || !email || !confirmPassword || !cpf) {
    return res.status(400).json({ msg: "Todos os campos são obrigatórios!" });
  }

  //Check if is a valid email
  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Seu email não é válido." });
  }

  //Try to add user
  try {
    //Check if user exists
    const foudedUser = await User.findOne({ email });
    if (foudedUser) {
      return res.status(400).json({
        msg: `Já existe um usuário com este email "${foudedUser.email}"!`,
      });
    }

    //Generate passwordHash
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(confirmPassword, salt);

    //Create new user

    const newUser = await User.create({
      full_name: newUsername,
      email,
      passwordHash,
      cpf,
    });

    //Get id from newUser
    const { _id } = newUser;

    return res.status(201).json({ email, _id });
  } catch (error) {
    next(error);
  }
});

//Login
router.post("/user/auth/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    //Look for user by email
    const user = await User.findOne({ email: username });

    //Check if email was fouded
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    //Compare the password if matchs
    const compareHash = bcrypt.compareSync(password, user.passwordHash);

    //Check if the password is wrong
    if (!compareHash) {
      return res.status(400).json({ msg: "Email ou senha são inválidos." });
    }
    if (user.status !== true) {
      return res
        .status(400)
        .json({ status: 401, msg: "Usuário não autorizado" });
    }
    const payload = {
      id: user._id,
      email: user.email,
    };

    //Create token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    if (token) {
      await Audit.create({
        descricao: "Fez login",
        operacao: "LOGIN",
        user_id: user._id,
      });
    }

    return res.status(200).json({ ...payload, token });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
export default router;
