import dbConnect from "@/lib/connection";

import Cart from "@/models/Cart";
import ProductItem from "@/models/ProductItem";

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
      console.log("GET: /api/buyer/cart: get cart items");
      try {
        const cartItems = await Cart.find({ user_id: user_session.user._id });

        if (!cartItems) {
          return res.status(400).json({ success: false });
        }
        const cart = await Promise.all(
          cartItems.map(async (item) => {
            const product_info = await ProductItem.findOne({
              _id: item.product_item,
            });
            return {
              _id: item._id,
              product_item: product_info,
              quantity: item.quantity,
            };
          })
        );
        res.status(200).json({ success: true, cart });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      break;
    case "POST":
      console.log("POST: /api/buyer/cart: add item to cart");

      const { product_id, quantity } = req.body;
      const sessionUpdateInsert = await conn.startSession();

      try {
        sessionUpdateInsert.startTransaction();

        //if items already in cart, update quantity
        const item = await Cart.findOne({
          user_id: user_session.user._id,
          product_item: product_id,
        });

        if (item) {
          const updated_item = await Cart.findOneAndUpdate(
            { _id: item._id },
            { quantity: item.quantity + quantity },
            { new: true, sessionUpdateInsert }
          ).catch((err) => {
            console.log(err);
            throw new Error("Error updating item in cart");
          });
          await sessionUpdateInsert.commitTransaction();
          console.log("Item updated in cart");
          console.log(updated_item);
          return res.status(200).json({ success: true, updated_item });
        }

        //if item not in cart, add item
        const added_item = await Cart.create(
          [
            {
              user_id: user_session.user._id,
              product_item: product_id,
              quantity: quantity,
            },
          ],
          { sessionUpdateInsert }
        ).catch((err) => {
          console.log(err);
          throw new Error("Error adding item to cart");
        });
        await sessionUpdateInsert.commitTransaction();
        console.log("Item added to cart");
        console.log(added_item);
        res.status(200).json({ success: true, added_item });
      } catch (err) {
        console.log(err);
        await sessionUpdateInsert.abortTransaction();
        console.log("Error: Item not added to cart");
        return res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      console.log("DELETE: /api/buyer/cart: delete item from cart");

      // get item_id from query
      const { item_id } = req.query;
      const sessionDelete = await conn.startSession();

      try {
        sessionDelete.startTransaction();
        const deleted_item = await Cart.findOneAndDelete(
          { _id: item_id },
          { session: sessionDelete }
        ).catch((err) => {
          console.log(err);
          throw new Error("Error deleting item from cart");
        });
        await sessionDelete.commitTransaction();
        console.log("Item deleted from cart");
        console.log(deleted_item);
        res.status(200).json({ success: true, deleted_item });
      } catch (err) {
        console.log(err);
        await sessionDelete.abortTransaction();
        console.log("Error: Item not deleted from cart");
        return res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
  }
}
