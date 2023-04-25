import dbConnect from "@/lib/connection";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import Order from "@/models/Order";

export default async function handler(req, res) {
  const user_session = await getServerSession(req, res, authOptions);

  if (!user_session) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }

  switch (req.method) {
    case "GET":
      try {
        // get all orders irrespective of user
        const orders = await Order.find({});

        let total_sales = 0;
        let total_orders = 0;

        orders.forEach((order) => {
          total_sales += order.total_price;
          total_orders += 1;
        });

        return res.status(200).json({
          success: true,
          total_sales,
          total_orders,
          orders: orders
        });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
