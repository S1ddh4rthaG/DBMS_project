import dbConnect from "@/lib/connection";

import UserAccount from "@/models/UserAccount";

export default async function handler(req, res) {
  const { method } = req;

  const conn = await dbConnect();

  switch (method) {
    case "POST":
      console.log("POST: /api/register/seller");
      const session = await conn.startSession();
      const {
        name,
        email_address,
        password,
        phone_number,
        street,
        address_line1,
        address_line2,
        pincode,
        city,
        state,
        country,
      } = req.body;

      try {
        session.startTransaction();

        const user = await UserAccount.create(
          [
            {
              name: name,
              email_address: email_address,
              password: password,
              phone_number: phone_number,
              type: "seller",
              street: street,
              address_line1: address_line1,
              address_line2: address_line2,
              pincode: pincode,
              city: city,
              state: state,
              country: country,
            },
          ],
          { session }
        ).catch((err) => {
          console.log(err);
          throw new Error("Error creating user account");
        });

        if (!user) {
          await session.abortTransaction();
          console.log("Error: User not created");
          return res.status(400).json({ success: false });
        }

        await session.commitTransaction();

        res.status(201).json({ success: true, data: user });
      } catch (error) {
        await session.abortTransaction();
        console.log(error);

        return res.status(500).json({ success: false, error: "Server error" });
      }
      session.endSession();
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
