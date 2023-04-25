import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { getSession, useSession } from "next-auth/react";
import { Router, useRouter } from "next/router";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function AddBank() {
  const session = useSession();
  const router = useRouter();

  const { data: banksList, error } = useSWR("/api/payments/bank", fetcher);
  const banks = banksList ? banksList.banks : [];

  const [formData, setFormData] = useState({
    bank_name: "",
    bank_code: "",
    address: "",
  });

  const { bank_name, bank_code, address } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = fetcher("/api/payments/bank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bank_name, bank_code, address }),
      });
      console.log(data);
      mutate("/api/payments/bank");
    } catch (err) {
      console.error(err.response.data);
    }
  };

  if (error) return <div>Failed to load banks</div>;
  if (!banks) return <div>Loading...</div>;

  return (
    <div>
      <h1>Add Bank</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Bank Name</label>
          <input
            type="text"
            name="bank_name"
            value={bank_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Bank Code</label>
          <input
            type="text"
            name="bank_code"
            value={bank_code}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Bank</button>
      </form>
      <h2>Banks</h2>
      <ul>
        {banks.map((bank) => (
          <li key={bank.bank_code}>
            {bank.bank_name} ({bank.bank_code})
          </li>
        ))}
      </ul>
    </div>
  );
}
