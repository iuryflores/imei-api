import { createRequire } from "module";
const require = createRequire(import.meta.url);
import * as dotenv from "dotenv";
dotenv.config();

/*teste - deploy ssh*/

import express from "express";
import logger from "morgan";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import clientesRoutes from "./routes/clients.routes.js";
import fornecedoresRoutes from "./routes/fornecedores.routes.js";
import imeiRoutes from "./routes/imei.routes.js";
import comprasRoutes from "./routes/compras.routes.js";
import vendasRoutes from "./routes/vendas.routes.js";
//import adminRoutes from "./routes/admin.routes.js";
import auditRoutes from "./routes/auditoria.routes.js";

import authMiddleware from "./middlewares/auth.middlewares.js";

import "./config/db.config.js";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

app.use(`/`, userRoutes);
app.use(authMiddleware);

//app.use(`/`, adminRoutes);
app.use(`/auditoria/`, auditRoutes);
app.use("/clientes/", clientesRoutes);
app.use("/fornecedores/", fornecedoresRoutes);
app.use("/imei/", imeiRoutes)
app.use("/compras/", comprasRoutes)
app.use("/vendas/", vendasRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
