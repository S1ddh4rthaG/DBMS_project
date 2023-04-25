// Return banks list

import dbConnect from "@/lib/connection";

import Bank from "@/models/Bank";

export default async function handler(req, res) {
  const conn = await dbConnect();

  switch (req.method) {
    case "GET":
      console.log("GET: /api/payments/bank: get banks list");

      try {
        const banks = await Bank.find();
        res.status(200).json({ success: true, banks });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      break;

    case "POST":
      console.log("POST: /api/payments/bank: create bank");
      const sessionCreate = await conn.startSession();
      try {
        const { bank_name, bank_code, address } = req.body;

        sessionCreate.startTransaction();
        const bank = await Bank.create([
          {
            bank_name: bank_name,
            bank_code: bank_code,
            address: address,
          },
        ]);
        await sessionCreate.commitTransaction();
        res.status(200).json({ success: true, bank });
      } catch (err) {
        console.log(err);
        await sessionCreate.abortTransaction();
        res.status(400).json({ success: false });
      }
      sessionCreate.endSession();
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
