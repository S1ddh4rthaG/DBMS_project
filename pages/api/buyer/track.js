import dbConnect from "@/lib/connection";
import { random } from "mathjs";

import TrackPath from "@/models/TrackPath";
import OrderItem from "@/models/OrderItem";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const user_session = await getServerSession(req, res, authOptions);

  if (!user_session) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const conn = await dbConnect();

  switch (req.method) {
    case "GET":
      console.log("GET: /api/track: get all the tracking status");

      try {
        const tracks = await TrackPath.find({
          user_id: user_session.user._id,
        })
          .populate("order_id")
          .populate("product_id");

        return res.status(200).json({ success: true, tracks: tracks });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      break;

    case "POST":
      console.log("POST: /api/track: create tracking status");

      const { order_id, product_id, current_location } = req.body;

      try {
        //find the order
        const track = await TrackPath.findOne({
          order_id: order_id,
          product_id: product_id,
          user_id: user_session.user._id,
        });

        console.log(track);

        if (!track) {
          return res.status(400).json({ success: false });
        }

        //change status to returning
        track.current_location = current_location;
        if (track.current_location >= track.travel_list.length) {
          // find the order item and change the status to delivered
          const orderItem = await OrderItem.findOne({
            order_id: order_id,
            product_id: product_id,
            user_id: user_session.user._id,
          });

          if (!orderItem) {
            return res.status(400).json({ success: false });
          }

          orderItem.status = "delivered";
          await orderItem.save();
          track.status = "delivered";
        }

        await track.save();

        return res.status(200).json({ success: true, tracks: track });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }

    default:
      res.status(400).json({ success: false });
      break;
  }
}
