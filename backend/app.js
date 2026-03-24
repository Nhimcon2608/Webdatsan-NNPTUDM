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
app.get("/api/health", healthHandler);
app.use("/api", routes);
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
