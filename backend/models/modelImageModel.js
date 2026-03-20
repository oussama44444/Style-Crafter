// backend/models/modelImageModel.js
import mongoose from "mongoose";
const modelImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("ModelImage", modelImageSchema);