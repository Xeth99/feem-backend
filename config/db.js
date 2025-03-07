import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = new URL(process.env.MONGO_URI);

    const conn = await mongoose.connect(mongoUri.toString());

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

