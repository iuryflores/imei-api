import { createRequire } from "module";
const require = createRequire(import.meta.url);
import * as dotenv from "dotenv";
dotenv.config();

/*teste - deploy ssh*/

import express from "express";
import logger from "morgan";
import cors from "cors";

import handleError from "./error-handling/index.js";

import userRoutes from "./routes/user.routes.js";
import clientesRoutes from "./routes/clients.routes.js";
import fornecedoresRoutes from "./routes/fornecedores.routes.js";
import imeiRoutes from "./routes/imei.routes.js";
import comprasRoutes from "./routes/compras.routes.js";
import vendasRoutes from "./routes/vendas.routes.js";
import userPrivateRoutes from "./routes/userPrivate.routes.js";
import auditRoutes from "./routes/auditoria.routes.js";
import caixasRoutes from "./routes/caixas.routes.js";
import lancamentosRoutes from "./routes/lancamento.routes.js";
import caixaDiarioRoutes from "./routes/caixaDiario.routes.js";

import authMiddleware from "./middlewares/auth.middlewares.js";

const app = express();

import "./config/db.config.js";

app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(express.json());

app.use(`/`, userRoutes);

app.use(authMiddleware);

app.use(`/user/`, userPrivateRoutes);
app.use(`/auditoria/`, auditRoutes);
app.use("/clientes/", clientesRoutes);
app.use("/fornecedores/", fornecedoresRoutes);
app.use("/imei/", imeiRoutes);
app.use("/compras/", comprasRoutes);
app.use("/vendas/", vendasRoutes);
app.use("/caixas/", caixasRoutes);
app.use("/lancamentos/", lancamentosRoutes);
app.use("/caixa/", caixaDiarioRoutes);

handleError(app);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
