// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     const mongoUri = new URL(process.env.MONGO_URI);

//     const conn = await mongoose.connect(mongoUri.toString());

//     console.log(`MongoDB Connected`);
//   } catch (error) {
//     console.log(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };


import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;
console.log(mongoUri);
if (!mongoUri) {
  throw new Error("Please define the MONGO_URI environment variable");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB Connected");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
