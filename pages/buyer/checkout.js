/* eslint-disable @next/next/no-img-element */
import { signIn, signOut, useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { use, useState } from "react";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function Home() {
  const session = useSession();
  const [formData, setFormData] = useState({
    account_id: "",
  });

  const [discount, setDiscount] = useState(0);
  const { data: cartList, errorCart } = useSWR("/api/buyer/cart", fetcher);
  const { data: orderList, errorOrder } = useSWR("/api/buyer/order", fetcher);
  const { data: couponsList, errorCoupons } = useSWR(
    "/api/advertiser/",
    fetcher
  );
  const coupons = couponsList ? couponsList.coupons : [];
  const { data: accountsList, errorAccounts } = useSWR(
    "/api/payments/account",
    fetcher
  );
  const accounts = accountsList ? accountsList.accounts : [];

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });

    console.log(formData);
  };

  const handleRemoveFromCart = async (item_id) => {
    console.log(item_id);
    const res = await fetcher(`/api/buyer/cart?item_id=${item_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    mutate("/api/buyer/cart");
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const res = await fetcher("/api/buyer/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log(res);
    mutate("/api/buyer/cart");
  };

  const findCouponDiscount = () => {
    let val = 0;
    if (!coupons) {
      val = 0;
    } else {
      for (let i = 0; i < coupons.length; i++) {
        if (coupons[i].couponCode == formData.coupon_code) {
          val = coupons[i].discount;
        }
      }
    }

    return val;
  };

  if (errorCart) return <div>Failed to load Cart</div>;
  if (!cartList) return <div>Loading... Carts</div>;

  if (errorOrder) return <div>Failed to load Orders</div>;
  if (!orderList) return <div>Loading... Orders</div>;

  if (errorAccounts) return <div>Failed to load Accounts</div>;
  if (!accountsList) return <div>Loading... Accounts</div>;
  return (
    <div className="container">
      <h1>Checkout</h1>
      <div className="card p-2 shadow-sm border m-3">
        <h4 className="p-3">Cart Items</h4>
        <table className="table borderless">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {cartList &&
              cartList.cart &&
              cartList.cart.map((item) => {
                return (
                  <tr key={item._id}>
                    <td>{item.product_item.name}</td>
                    <td>{item.product_item.price}</td>
                    <td>{item.quantity}</td>
                    <td>{item.product_item.price * item.quantity}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveFromCart(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <div className="shadow-sm rounded border p-3 mb-2">
              <h4>Choose Account</h4>
              <select
                class="form-select"
                name="account_id"
                onChange={(e) =>
                  setFormData({ ...formData, account_id: e.target.value })
                }
                value={formData.account_id}
              >
                <option value="">Select Account</option>;
                {accounts &&
                  accounts.map((item) => {
                    return (
                      <option key={item._id} value={item._id}>
                        {item.account} - {item.balance}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="shadow-sm rounded border p-3 mb-2 text-end">
              <h4 className="text-start">Choose Coupon</h4>
              <input
                class="form-control"
                name="coupon_code"
                onChange={handleChange}
                value={formData.coupon_code}
              ></input>
              {
                <p className="text-muted border d-inline-block p-2">
                  DISCOUNT:
                  {findCouponDiscount()}
                </p>
              }
            </div>
            <div className="shadow-sm rounded border p-3 mb-2">
              <h4>Total</h4>
              <p className="fw-bold fs-5">
                $
                {cartList &&
                  cartList.cart &&
                  cartList.cart.reduce(
                    (acc, item) =>
                      acc + item.product_item.price * item.quantity,
                    0
                  ) *
                    (1 - findCouponDiscount() / 100)}
              </p>
              <button
                className="btn btn-primary"
                onClick={handleCheckout}
                disabled={cartList ? false : true}
              >
                Checkout
              </button>
            </div>
          </div>
          <div class="col-md-6">
            <div className="shadow-sm rounded border p-3 mb-2">
              <h4>Address</h4>
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <th scope="row">Address Line 1</th>
                    <td>
                      {session &&
                        session.data &&
                        session.data.user?.address_line1}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Address Line 2</th>
                    <td>
                      {session &&
                        session.data &&
                        session.data.user?.address_line2}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Street</th>
                    <td>
                      {session && session.data && session.data.user?.street}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">City</th>
                    <td>
                      {session && session.data && session.data.user?.city}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">State</th>
                    <td>
                      {session && session.data && session.data.user?.state}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Pincode</th>
                    <td>
                      {session && session.data && session.data.user?.pincode}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Country</th>
                    <td>
                      {session && session.data && session.data.user?.country}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* <br></br>
      <br></br>
      <h3>Orders</h3>
      {orderList.orders.map((item) => {
        return (
          <div className="border m-2 p-2" key={item._id}>
            <h2>{item._id}</h2>
            <p>{item.address}</p>
            <p>{item.total_price}</p>
            <p>{item.status}</p>
            <p>{item.account_id}</p>

            {item.products.map((product) => {
              return (
                <div className="border m-2 p-2" key={product._id}>
                  <h2>{product.name}</h2>
                  <p>{product.price}</p>
                  <p>{product.quantity}</p>
                  <p>{product.final_price}</p>
                </div>
              );
            })}
          </div>
        );
      })} */}
    </div>
  );
}
