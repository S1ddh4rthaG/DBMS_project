import dbConnect from "@/lib/connection";
import { count, random } from "mathjs";
import math from "mathjs";

import UserAccount from "@/models/UserAccount";
import ProductItem from "@/models/ProductItem";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import OrderItem from "@/models/OrderItem";
import TrackPath from "@/models/TrackPath";
import Coupon from "@/models/Coupon";
import Warehouse from "@/models/Warehouse";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import BankAccount from "@/models/BankAccount";

const gen_random_warehouses = async () => {
  let n = random(3, 5);
  let warehouses = await Warehouse.aggregate([{ $sample: { size: n } }]);
  console.log("Random Warehouses", warehouses);
  return warehouses;
};

export default async function handler(req, res) {
  const user_session = await getServerSession(req, res, authOptions);

  if (!user_session) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const conn = await dbConnect();

  switch (req.method) {
    case "GET":
      console.log("GET: /api/buyer/order: get orders");
      const session = await conn.startSession();

      try {
        session.startTransaction();
        const orders = await Order.find({ user_id: user_session.user._id });
        console.log("Orders", orders);
        orders.forEach(async (order) => {
          let orderItems = await OrderItem.find({ order_id: order._id });

          let all_delivered = orderItems.every((item) => {
            return item.status === "delivered" || item.status === "returned";
          });

          console.log("All Delivered", all_delivered);
          if (all_delivered) {
            order.status = "delivered";
            await order.save();
          } else {
            order.status = "processing";
            await order.save();
          }
        });

        if (!orders) {
          return res.status(400).json({ success: false });
        }

        await session.commitTransaction();
        res.status(200).json({ success: true, orders });
      } catch (err) {
        console.log(err);
        await session.abortTransaction();
        return res.status(400).json({ success: false });
      }
      break;
  }
}
