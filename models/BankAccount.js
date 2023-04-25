/*
Model Fields:
- user_id: int
- bank_id: int
- account_number: string
- balance: float

A user can have only one bank account per bank
*/

import mongoose from "mongoose";

const BankAccountSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAccount",
    required: true,
  },
  bank_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
    required: true,
  },
  account_name: {
    type: String,
    required: true,
  },
  account_number: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    min: 0,
  },
});

export default mongoose.models.BankAccount || mongoose.model("BankAccount", BankAccountSchema);
