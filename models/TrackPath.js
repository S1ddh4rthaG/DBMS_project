/*
For every item in an order, generate (3, 4, 5) random warehouses and add to array final destination should be address
Model Fields:
    id: int
    current_location: default 0
    travel_list: array of warehouses randomly generated
    adder: int (+1 or -1 to indicate direction)
    status: [shipping, returing, delivered, cancelled]
    order_id: int
    product_id: int
    user_id: int
*/

import { random } from "mathjs";
import mongoose from "mongoose";

import Warehouse from "./Warehouse";

const TrackPathSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductItem",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAccount",
    required: true,
  },
  current_location: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  travel_list: {
    type: Array,
    required: true,
    default: [],
  },
  status: {
    type: String,
    required: true,
    enum: ["shipping", "returning", "delivered", "returned", "cancelled"],
    default: "shipping",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const TrackPath =
  mongoose.models.TrackPath || mongoose.model("TrackPath", TrackPathSchema);
export default TrackPath;
