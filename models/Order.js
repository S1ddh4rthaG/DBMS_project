/*
  Model Fields:
  - id: int
  - user_id: int
  - products:[
    - product_id: int
    - quantity: int
    - price: float
    - final_price: float
  ]
  - total_price: float
  - created_at: datetime
  - updated_at: datetime
  - status: string
*/

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAccount",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductItem",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      coupon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
      discount: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 99,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      final_price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  total_price: {
    type: Number,
    required: true,
    min: 0,
  },
  payment_method: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankAccount",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ["shipping", "processing", "delivered", "cancelled"],
    default: "shipping",
  },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
