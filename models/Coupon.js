import mongoose from "mongoose";
const { v4: uuidv4 } = require("uuid");

const couponSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAccount",
    required: true,
    validate: {
      validator: async function (v) {
        const user = await mongoose.model("UserAccount").findById(v);
        return user && user.type === "advertiser";
      },
      message: "User does not exist or is not a advertiser",
    },
  },
  note: {
    type: String,
    required: true,
  },
  advertiser_bankaccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankAccount",
    required: true,
    validate: {
      validator: async function (v) {
        const bankaccount = await mongoose.model("BankAccount").findById(v);

        if (!bankaccount) {
          return false;
        }

        if (bankaccount.user_id.toString() !== this.advertiser.toString()) {
          return false;
        }

        return true;
      },
      message: function (props) {
        if (!props.value) {
          return "Bank account does not exist";
        } else {
          return "Bank account does not belong to the advertiser";
        }
      },
    },
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 99,
  },
  expired: {
    type: Boolean,
  },
  couponCode: {
    type: String,
    unique: true,
    required: true,
    default: function () {
      let code = uuidv4().slice(0, 8).toUpperCase();
      return code;
    },
  },
});

export default mongoose.models.Coupons ||
  mongoose.model("Coupons", couponSchema);
