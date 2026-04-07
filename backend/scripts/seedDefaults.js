// Script tiện ích để khởi tạo database và in ra các tài khoản mặc định.
import dotenv from "dotenv";

import { connectToDatabase, getCollection } from "../utils/database.js";

dotenv.config();

await connectToDatabase();

const accounts = await getCollection("accounts")
  .find({}, { projection: { _id: 0, email: 1, role: 1, fullName: 1 } })
  .sort({ role: 1, email: 1 })
  .toArray();

console.log("Default accounts are ready:");
for (const account of accounts) {
  console.log(`- ${account.email} | ${account.role} | ${account.fullName}`);
}

process.exit(0);
