import { createRequire } from "module";
const require = createRequire(import.meta.url);
import * as dotenv from "dotenv";
dotenv.config();

/*teste - deploy ssh*/

import express from "express";
import logger from "morgan";
import cors from "cors";


import userRoutes from "./routes/user.routes.js";
//import adminRoutes from "./routes/admin.routes.js";
//import auditRoutes from "./routes/audit.routes.js";

//import authMiddleware from "./middlewares/auth.middlewares.js";

import "./config/db.config.js";

const app = express();


app.use(cors());
app.use(logger("dev"));
app.use(express.json());

//app.use(authMiddleware);

//app.use(`/`, adminRoutes);
//app.use(`/`, auditRoutes);
app.use(`/`, userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});