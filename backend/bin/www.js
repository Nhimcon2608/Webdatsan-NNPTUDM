// Chỉ khởi động HTTP server sau khi MongoDB đã sẵn sàng.
import http from "http";
import app from "../app.js";
import { connectToDatabase } from "../utils/database.js";

const port = Number(process.env.PORT || 8080);
app.set("port", port);

try {
  // Dừng sớm nếu database không khởi tạo được.
  await connectToDatabase();

  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
} catch (error) {
  console.error("Failed to connect to MongoDB", error);
  process.exit(1);
}
