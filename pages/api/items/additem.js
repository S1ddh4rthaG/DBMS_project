import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import dbConnect from "@/lib/connection";
import ProductItem from "@/models/ProductItem";

export default async function handler(req, res) {
  const user_session = await getServerSession(req, res, authOptions);
  console.log(user_session);
  if (!user_session) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const conn = await dbConnect();

  switch (req.method) {
    case "POST":
      const { name, description, image, type, price, stock_quantity } = req.body;
      console.log(req.body);

      const session = await conn.startSession();
      try {
        session.startTransaction();

        const product_item = await ProductItem.create(
          [
            {
              name: name,
              description: description,
              image: image,
              type: type,
              price: price,
              stock_quantity: stock_quantity,
              seller_id: user_session.user._id,
            },
          ],
          { session }
        ).catch((err) => {
          console.log(err);
          throw new Error("Error creating product item");
        });

        await session.commitTransaction();
        res.status(200).json({
          success: true,
          message: "Product created",
          product_item,
        });
      } catch (err) {
        console.log(err);
        await session.abortTransaction();
        res
          .status(500)
          .json({ success: false, message: "Error creating product" });
      }

      session.endSession();
      break;
    default:
      res.status(400).json({ success: false, message: "Invalid request" });
      break;
  }
}
