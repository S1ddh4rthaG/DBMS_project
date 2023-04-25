// Return banks list

import dbConnect from "@/lib/connection";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import Bank from "@/models/Bank";
import BankAccount from "@/models/BankAccount";

export default async function handler(req, res) {
  const conn = await dbConnect();

  const user_session = await getServerSession(req, res, authOptions);

  if (!user_session) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const session = await conn.startSession();
  switch (req.method) {
    case "GET":
      console.log("GET: /api/payments/account: get accounts list");

      try {
        const accounts = await BankAccount.find({
          user_id: user_session.user._id,
        });
        res.status(200).json({ success: true, accounts });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      break;

    case "POST":
      console.log("POST: /api/payments/account: create account");

      try {
        session.startTransaction();

        const { bank_id, account_name, account_number, balance } = req.body;

        // Check if bank exists
        const bank = await Bank.findById(bank_id);
        if (!bank) {
          return res.status(400).json({ success: false });
        }

        // Check if account exists
        const account = await BankAccount.findOne({
          user_id: user_session.user._id,
          account_number: account_number,
        });
        if (account) {
          account.balance = balance;
          await account.save();
          await session.commitTransaction();
          res.status(200).json({ success: true, account });
        }

        // Create account
        const new_account = await BankAccount.create([
          {
            user_id: user_session.user._id,
            bank_id: bank_id,
            account_name: account_name,
            account_number: account_number,
            balance: balance,
          },
        ]);

        await session.commitTransaction();
        res.status(200).json({ success: true, account: new_account });
      } catch (err) {
        console.log(err);
        await session.abortTransaction();
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
  }
  session.endSession();
}
