import { Router } from "express";
import User from "../models/User.model.js";

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
});
router.get("/edit/", async (req, res, next) => {
  // const { user_Id } = req.body;
  // console.log(req);
  // try {
  //   const user = await User.findById(user_Id._id);
  //   if (!user) {
  //     return res.status(404).json({ msg: "Usuário não encontrado/ativado!" });
  //   }
  //   res.status(200).json(user);
  // } catch (error) {
  //   next(error);
  // }
});

export default router;
