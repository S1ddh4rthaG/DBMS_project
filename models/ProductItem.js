import mongoose from "mongoose";

const ProductItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  stock_quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAccount",
    required: true,
    validate: {
      validator: async function (v) {
        const user = await mongoose.model("UserAccount").findById(v);
        return user && user.type === "seller";
      },
      message: "User does not exist or is not a seller",
    },
  },
});

export default mongoose.models.ProductItem ||
  mongoose.model("ProductItem", ProductItemSchema);
