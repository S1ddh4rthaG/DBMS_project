import dbConnect from "@/lib/connection";
import { random } from "mathjs";

import ProductItem from "@/models/ProductItem";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const user_session = await getServerSession(req, res, authOptions);

  if (!user_session) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const conn = await dbConnect();

  switch (req.method) {
    case "GET":
      console.log("GET: /api/seller/inventory: get all the inventory");

      try {
        // get all product item sold by the seller
        const productItems = await ProductItem.find({
          seller_id: user_session.user._id,
        });

        console.log(productItems);
        if (!productItems) {
          return res.status(400).json({ success: false });
        }

        return res.status(200).json({ success: true, products: productItems });
      } catch (error) {
        return res.status(400).json({ success: false });
      }
      break;
  }
}
