import mongoose from "mongoose";

const categoriesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

export default mongoose.model("Categories", categoriesSchema);
