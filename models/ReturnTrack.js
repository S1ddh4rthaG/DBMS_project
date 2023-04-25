/*
Model Field:
- product_id: int
- order_id: int
- seller_id: int
- user_id: int
- status: bool
- reason: str
- created_at: datetime
- updated_at: datetime
*/

import mongoose from "mongoose";

const ReturnTrackSchema = new mongoose.Schema({
  order_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderItem",
    required: true,
  },
  travel_list: {
    type: Array,
    required: true,
    default: [],
  },
  return_rejected: {
    type: Boolean,
    required: true,
    default: false,
  },
  responded: {
    type: Boolean,
    required: true,
    default: false,
  },
  reason_seller: {
    type: String,
  },
  user_complaint: {
    type: String,
  },
});

export default mongoose.models.ReturnTrack ||
  mongoose.model("ReturnTrack", ReturnTrackSchema);
