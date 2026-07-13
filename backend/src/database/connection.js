const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Failed");
    console.error(err.message);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 Mongoose Error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("🟡 MongoDB Disconnected");
});

module.exports = connectDB;