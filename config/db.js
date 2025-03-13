import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = new URL(process.env.MONGO_URI);

    const conn = await mongoose.connect(mongoUri.toString(), {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

