import dbConnect from "@/lib/connection";
import { random } from "mathjs";

import ReturnTrack from "@/models/ReturnTrack";
import OrderItem from "@/models/OrderItem";
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
      console.log("GET: /api/seller/return: get all the return status");

      try {
        // get all product item sold by the seller
        const productItems = await ProductItem.find({
          seller_id: user_session.user._id,
        });

        if (!productItems) {
          return res.status(400).json({ success: false });
        }

        // get all order item that has the product item
        const orderItems = await OrderItem.find({
          product_id: {
            $in: productItems.map((productItem) => productItem._id),
          },
        });

        if (!orderItems) {
          return res.status(400).json({ success: false });
        }

        // get all return track that has the order item
        const returnTracks = await ReturnTrack.find({
          order_item_id: { $in: orderItems.map((orderItem) => orderItem._id) },
        });

        if (!returnTracks) {
          return res.status(400).json({ success: false });
        }

        //populate the order_item field with the order item, product id, user id
        const returnTracksPopulated = await ReturnTrack.populate(returnTracks, {
          path: "order_item_id",
          populate: {
            path: "product_id",
            path: "user_id",
          },
        });

        console.log(returnTracksPopulated);

        return res
          .status(200)
          .json({ success: true, returnTracks: returnTracks });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      break;
    case "POST":
      console.log("POST: /api/seller/return: create a new return track");

      try {
        const { returnTrackId, reason_seller, accept } = req.body;
        // get the return track
        const returnTrack = await ReturnTrack.findById(returnTrackId);

        if (!returnTrack) {
          return res.status(400).json({ success: false });
        }

        // update the return track
        returnTrack.responded = true;
        returnTrack.return_rejected = accept;

        if (reason_seller) {
          returnTrack.reason_seller = reason_seller;
        }

        await returnTrack.save();
        return res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }

      break;
  }
}
