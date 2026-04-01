import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./utils/errorHandlers.js";
import { attachRequestContext } from "./utils/requestContext.js";

dotenv.config();

const app = express();
const API_BASE_PATH = String(process.env.API_BASE_PATH || "/api").replace(/\/+$/, "");
const API_VERSION = String(process.env.API_VERSION || "v1")
  .replace(/^\/+/, "")
  .replace(/\/+$/, "");
const API_PREFIX = API_VERSION ? `${API_BASE_PATH}/${API_VERSION}` : API_BASE_PATH;

function healthHandler(_req, res) {
  res.json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  });
}

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(attachRequestContext);

app.get("/health", healthHandler);
app.get(`${API_BASE_PATH}/health`, healthHandler);
app.get(`${API_PREFIX}/health`, healthHandler);
app.use(API_PREFIX, routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
