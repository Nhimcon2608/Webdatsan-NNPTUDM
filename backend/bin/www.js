import http from 'http';
import app from '../app.js'; // giả sử app.js ở thư mục gốc hoặc src/
import dotenv from 'dotenv';
import connectDB from '../src/config/db.js'; // điều chỉnh path nếu bạn đặt src/config/db.js

// Load biến môi trường từ .env ngay đầu file
dotenv.config();

const port = Number(process.env.PORT || 8080);
app.set('port', port);

// Hàm khởi động server + kết nối DB
const startServer = async () => {
  try {
    // 1. Kết nối MongoDB trước khi listen server
    await connectDB();
    console.log('Database connection established successfully');

    // 2. Tạo HTTP server
    const server = http.createServer(app);

    // 3. Listen port
    server.listen(port, () => {
      console.log(`API server đang chạy tại http://localhost:${port}`.yellow.bold);
      console.log(`Môi trường: ${process.env.NODE_ENV || 'development'}`.dim);
    });

    // 4. Xử lý lỗi listen (ví dụ port bị chiếm)
    server.on('error', onError);

    // 5. Graceful shutdown khi Ctrl+C hoặc kill process
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('HTTP server closed.');
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed.');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received. Shutting down...');
      server.close(() => process.exit(0));
    });

  } catch (err) {
    console.error('Không thể khởi động server:', err);
    process.exit(1);
  }
};

// Hàm xử lý lỗi server (từ Express generator)
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Xử lý các lỗi phổ biến
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' yêu cầu quyền Administrator');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' đã bị chiếm dụng');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Khởi động mọi thứ
startServer();