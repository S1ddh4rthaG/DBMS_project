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
      console.log("GET: /api/seller/stats: get all the stats");
      //get all the product items sold by the seller
      const productItems = await ProductItem.find({
        seller_id: user_session.user._id,
      });

      //get all the order items that has the product items
      const orderItems = await OrderItem.find({
        product_id: {
          $in: productItems.map((productItem) => productItem._id),
        },
      });

      //get all the return tracks that has the order items
      const returnTracks = await ReturnTrack.find({
        order_item_id: {
          $in: orderItems.map((orderItem) => orderItem._id),
        },
      });

      //total sales of the seller
      const totalSales = orderItems.reduce((acc, orderItem) => {
        return acc + orderItem.quantity * orderItem.price;
      }, 0);

      const itemsSold = orderItems.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      //order items that has been returned
      const returnTrackIds = returnTracks.map((returnTrack) => {
        return returnTrack.order_item_id;
      });

      //make all the ids to string
      let returnTrackIdsString = returnTrackIds.map((returnTrackId) => {
        return returnTrackId.toString();
      });

      const returnedOrderItems = orderItems.filter((orderItem) => {
        //convert to string to compare
        return returnTrackIdsString.includes(orderItem._id.toString());
      });

      //total return of the seller
      const totalReturn = returnedOrderItems.reduce((acc, orderItem) => {
        return acc + orderItem.final_price;
      }, 0);

      const itemsReturned = returnedOrderItems.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      //total profit of the seller
      const totalProfit = totalSales - totalReturn;

      return res.status(200).json({
        success: true,
        stats: [totalSales, itemsSold, totalReturn, itemsReturned, totalProfit],
      });
      break;
  }
}
