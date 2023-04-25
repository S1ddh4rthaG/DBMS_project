/*
Model Fields:
- bank_id: int
- bank_name: string
- bank_code: string
- address: string
*/

import mongoose from "mongoose";

const BankSchema = new mongoose.Schema({
  bank_name: {
    type: String,
    required: true,
  },
  bank_code: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Bank || mongoose.model("Bank", BankSchema);