import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

import { getSession, useSession } from "next-auth/react";
import { Router, useRouter } from "next/router";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function AddCoupon() {
  const session = useSession();
  const router = useRouter();

  const { data: itemsList, errorItems } = useSWR("/api/items", fetcher);
  const items = itemsList ? itemsList.items : [];

  const { data: couponList, error } = useSWR("/api/advertiser/", fetcher);
  const coupons = couponList ? couponList.coupons : [];

  const { data: accountList, errorAccounts } = useSWR(
    "/api/payments/account",
    fetcher
  );
  const accounts = accountList ? accountList.accounts : [];

  // check if user in the session is authenticated
  useEffect(() => {
    if (session.status === "authenticated") {
      if (session.data.user.type !== "advertiser") {
        router.push("/");
      }
    }
  }, [session, router]);

  const [formData, setFormData] = useState({
    discount: "",
    advertiser_bankaccount: "",
    note: "",
    seller_id: "",
  });

  const { discount, advertiser_bankaccount, note, seller_id } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = fetcher("/api/advertiser/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discount,
          advertiser_bankaccount,
          note,
          seller_id,
        }),
      });
      console.log(data);
      mutate("/api/advertiser/");
    } catch (err) {
      console.error(err.response.data);
    }
  };

  if (error) return <div>Failed to load coupons</div>;
  if (!coupons) return <div>Loading...</div>;

  return (
    <div>
      <h1>Add Coupon</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Discount</label>
          <input
            type="text"
            name="discount"
            value={discount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Bank Account</label>
          <select
            name="advertiser_bankaccount"
            value={advertiser_bankaccount}
            onChange={handleChange}
          >
            <option value="">Select Bank Account</option>
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.account_number} - {account._id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Note</label>
          <input type="text" name="note" value={note} onChange={handleChange} />
        </div>
        <button type="submit">Add Coupon</button>
      </form>
      <div>
        <h2>Coupons</h2>
        <table>
          <thead>
            <tr>
              <th>Discount</th>
              <th>Bank Account</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>{coupon.discount}</td>
                <td>{coupon.advertiser_bankaccount}</td>
                <td>{coupon.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
