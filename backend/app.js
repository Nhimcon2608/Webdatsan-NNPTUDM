// Khởi tạo Express app, middleware dùng chung và điểm mount API cấp cao.
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { handleMomoIpn } from "./controllers/paymentController.js";
import routes from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./utils/errorHandlers.js";
import { attachRequestContext } from "./utils/requestContext.js";
import { getUploadsRoot } from "./utils/uploadStorage.js";

dotenv.config();

const app = express();
const API_BASE_PATH = String(process.env.API_BASE_PATH || "/api").replace(/\/+$/, "");
const API_VERSION = String(process.env.API_VERSION || "v1")
  .replace(/^\/+/, "")
  .replace(/\/+$/, "");
const API_PREFIX = API_VERSION ? `${API_BASE_PATH}/${API_VERSION}` : API_BASE_PATH;

// Health check được mở ở nhiều đường dẫn để giữ tương thích.
function healthHandler(_req, res) {
  res.json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  });
}

// Middleware toàn cục được mount một lần để mọi route có cùng cách bảo mật và parse dữ liệu.
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(attachRequestContext);
app.use("/uploads", express.static(getUploadsRoot()));

// Health check và callback thanh toán nằm ngoài router tài nguyên chính.
app.get("/health", healthHandler);
app.get(`${API_BASE_PATH}/health`, healthHandler);
app.get(`${API_PREFIX}/health`, healthHandler);
app.post(`${API_BASE_PATH}/payment/momo/ipn`, handleMomoIpn);

// Toàn bộ API nghiệp vụ được gom dưới prefix có version.
app.use(API_PREFIX, routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
