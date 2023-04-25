import dbConnect from "@/lib/connection";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import TrackPath from "@/models/TrackPath";
import Warehouse from "@/models/Warehouse";
import { random } from "mathjs";

export default async function handler(req, res) {
  const conn = await dbConnect();
  const user_session = await getServerSession(req, res, authOptions);

  if (!user_session) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const session = await conn.startSession();
  switch (req.method) {
    case "GET":
      console.log("GET: /api/tracking: get tracking list");

      try {
        const tracking = await TrackPath.find({
          user_id: user_session.user._id,
        });

        //group by order_id
        const tracking_grouped = tracking.reduce((r, a) => {
          r[a.order_id] = r[a.order_id] || [];
          r[a.order_id].push(a);
          return r;
        }, Object.create(null));
        res.status(200).json({ success: true, tracking_grouped });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      break;

    case "POST":
      console.log("POST: /api/tracking: change tracking");

      const session = await conn.startSession();
      try {
        session.startTransaction();

        const { order_id, product_id } = req.body;
        console.log("Order ID", order_id);
        console.log("Product ID", product_id);
        const tracking = await TrackPath.findOne({
          user_id: user_session.user._id,
          order_id: order_id,
          product_id: product_id,
        });

        // move declaration here
        let status = tracking.status;

        // check status
        console.log("Status", status);
        console.log("Tracking", tracking);

        if (status == "delivered") {
          return res.status(400).json({ success: false });
        }

        const travel_len = tracking.travel_list.length;
        const current_loc = tracking.current_location;

        let addr = 0;
        if (status == "shipping") {
          addr = 1;
        } else if (status == "returned") {
          addr = -1;
        }

        // update current location
        tracking.current_location = current_loc + addr;

        // check if current location is the last location
        if (tracking.current_location == travel_len) {
          tracking.status = "delivered";
        }

        // check if current location is the first location
        if (tracking.current_location == -1) {
          tracking.status = "returned";
        }

        await tracking.save();
        await session.commitTransaction();
        res.status(200).json({ success: true, tracking });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      break;
  }
}
