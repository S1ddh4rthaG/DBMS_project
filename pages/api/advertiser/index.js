// Create page to get all the coupons for a specific advertiser, update the coupon code, and delete the coupon

import dbConnect from "@/lib/connection";

import Coupon from "@/models/Coupon";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const user_session = await getServerSession(req, res, authOptions);

  if (!user_session) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (user_session.user.type !== "advertiser") {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const conn = await dbConnect();

  switch (req.method) {
    case "GET":
      console.log("GET: /api/advertiser/coupons: get all coupons");

      try {
        const coupons = await Coupon.find({
          advertiser: user_session.user._id,
        });

        res.status(200).json({ success: true, coupons: coupons });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }

      break;

    case "POST":
      console.log("POST: /api/advertiser/coupons: create new coupon");

      const { discount, note, advertiser_bankaccount } = req.body;

      try {
        const coupon = await Coupon.create({
          discount: discount,
          note: note,
          advertiser_bankaccount: advertiser_bankaccount,
          advertiser: user_session.user._id,
        });

        res.status(200).json({ success: true, coupon });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      console.log("DELETE: /api/advertiser/coupons: delete coupon");

      const { coupon_id } = req.query;

      try {
        const coupon = await Coupon.findOneAndDelete({
          _id: coupon_id,
          advertiser: user_session.user._id,
        });

        if (!coupon) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, coupon });
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
