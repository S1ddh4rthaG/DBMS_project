import dbConnect from "@/lib/connection";
import { random } from "mathjs";

import UserAccount from "@/models/UserAccount";
import OrderItem from "@/models/OrderItem";
import Order from "@/models/Order";
import ReturnTrack from "@/models/ReturnTrack";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import TrackPath from "@/models/TrackPath";

export default async function handler(req, res) {
  const user_session = await getServerSession(req, res, authOptions);

  if (!user_session) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const conn = await dbConnect();

  switch (req.method) {
    case "GET":
      console.log("GET: /api/return: get all the returning or returned orders");

      try {
        //see in order items
        const orders = await OrderItem.find({
          user_id: user_session.user._id,
          status: { $in: ["returning", "returned"] },
        });
        console.log(orders, "orders");

        if (!orders) {
          return res.status(400).json({ success: false });
        }

        const return_paths = await orders.map((order) => {
          return ReturnTrack.findOne({ order_item_id: order._id });
        });

        const return_paths_resolved = await Promise.all(return_paths);
        console.log(return_paths_resolved, "return_paths_resolved");
        return await res.status(200).json({ success: true, returns: orders, return_paths: return_paths_resolved});
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      break;

    case "POST":
      console.log("POST: /api/return: create return order");

      const { order_id, product_id } = req.body;
      console.log(order_id, product_id);

      const session = await conn.startSession();
      try {
        session.startTransaction();
        const orderItems = await OrderItem.findOne({
          order_id: order_id,
          product_id: product_id,
          user_id: user_session.user._id,
        });

        if (!orderItems) {
          console.log("No order items");
          return res.status(400).json({ success: false });
        }

        //change status to returning
        orderItems.status = "returning";
        console.log(orderItems, "orderItems");
        await orderItems.save();

        // find the order return track
        const returnTrack = await TrackPath.findOne({
          order_id: order_id,
          product_id: product_id,
        });
        
        console.log(returnTrack, "returnTrack");
        if (!returnTrack) {
          return res.status(200).json({ success: true, returns: orderItems });
        }


        // create a return track
        const returnTrace = await ReturnTrack.create({
          order_item_id: orderItems._id,
          travel_list: returnTrack.travel_list.reverse(),
        });

        await returnTrace.save();
        await session.commitTransaction();
        return res.status(200).json({ success: true, returns: orderItems });
      } catch (err) {
        console.log(err);
        await session.abortTransaction();
        return res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
