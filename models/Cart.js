import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAccount",
    required: true,
  },
  product_item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductItem",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
