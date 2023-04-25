import mongoose from "mongoose";

const UserAccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email_address: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  address_line1: {
    type: String,
    required: true,
  },
  address_line2: {
    type: String,
  },
  pincode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["admin", "customer", "seller", "advertiser"],
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
});

export default mongoose.models.UserAccount ||
  mongoose.model("UserAccount", UserAccountSchema);
