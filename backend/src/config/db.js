import mongoose from 'mongoose';
import 'colors'; // Thêm dòng này để fix lỗi undefined 'underline'

const connectDB = async () => {
  try {
    // Đảm bảo MONGO_URI đã được load từ file .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected! Attempting to reconnect...'.yellow);
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:'.red, err);
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`.red);
    process.exit(1); 
  }
};

export default connectDB;