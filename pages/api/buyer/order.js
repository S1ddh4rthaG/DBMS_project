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
          }else{
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
    case "POST":
      console.log("POST: /api/buyer/order: create order");
      const sessionCreate = await conn.startSession();

      try {
        sessionCreate.startTransaction();
        const user_id = user_session.user._id;

        const { account_id, coupon_code } = req.body;
        const { street, address_line1, address_line2, city, state, country } =
          user_session.user;

        console.log("Account ID", account_id);
        console.log("Coupon Code", coupon_code);

        const combinedAddress = `Street: ${street}, Address Line 1: ${address_line1}, Address Line 2: ${address_line2}, City: ${city}, State: ${state}, Country: ${country}`;

        const products = await Cart.find({ user_id });
        let productDetails = await Promise.all(
          products.map(async (product) => {
            const product_info = await ProductItem.findOne({
              _id: product.product_item,
            });

            product_info.stock_quantity -= product.quantity;
            await product_info.save();
            return {
              _id: product._id,
              product_item: product_info,
              quantity: product.quantity,
            };
          })
        );

        productDetails = productDetails.map((item) => {
          return {
            product_id: item.product_item._id,
            name: item.product_item.name,
            price: item.product_item.price,
            final_price: item.product_item.price * item.quantity,
            quantity: item.quantity,
          };
        });

        let totalPrice = productDetails.reduce(
          (acc, item) => acc + item.final_price,
          0
        );

        //check if coupon is valid
        if (coupon_code) {
          const coupon = await Coupon.findOne({ couponCode: coupon_code });
          if (!coupon) {
            console.log("Coupon not found");
          } else {
            console.log("Coupon found");
            totalPrice =
              totalPrice -
              (0.9 > coupon.discount / 100 ? coupon.discount / 100 : 0.9) *
                totalPrice;
          }
        }
        const bankAccount = await BankAccount.findOne({
          _id: account_id,
        });

        if (!bankAccount) {
          return res
            .status(400)
            .json({ success: false, message: "Bank account not found" });
        }

        //check if user has enough money
        if (bankAccount.balance < totalPrice) {
          return res
            .status(400)
            .json({ success: false, message: "Not enough money" });
        }

        const order = await Order.create({
          user_id: user_id,
          products: productDetails,
          address: combinedAddress,
          total_price: totalPrice,
          payment_method: account_id,
        });

        //update bank account balance
        bankAccount.balance -= totalPrice;
        await bankAccount.save();
        await Cart.deleteMany({ user_id });

        console.log(productDetails);

        // add the products to OrderItem collection
        const orderItems = await Promise.all(
          productDetails.map(async (product) => {
            const orderItem = await OrderItem.create({
              product_id: product.product_id,
              order_id: order._id,
              user_id: user_id,
              name: product.name,
              quantity: product.quantity,
              price: product.price,
              coupon_id: null,
              final_price: product.price * product.quantity,
              current_location: 0,
            });
            return orderItem;
          })
        );

        // add the products to TrackPath collection
        const trackPaths = await Promise.all(
          productDetails.map(async (product) => {
            const trackPath = await TrackPath.create({
              product_id: product.product_id,
              order_id: order._id,
              user_id: user_id,
              current_location: 0,
              travel_list: await gen_random_warehouses(),
            });
            console.log("Track Path", trackPath);
            return trackPath;
          })
        );

        await Cart.deleteMany({ user_id });
        console.log("Order", order);
        await sessionCreate.commitTransaction();
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        await sessionCreate.abortTransaction();
        return res
          .status(400)
          .json({ success: false, message: "Something went wrong" });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
