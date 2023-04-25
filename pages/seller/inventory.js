import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function ReturnResponse() {
  const session = useSession();
  const router = useRouter();

  const { data: productlist, error } = useSWR("/api/seller/inventory", fetcher);
  const products = productlist ? productlist.products : [];

  // check if user in the session is authenticated
  useEffect(() => {
    if (session.status === "authenticated") {
      if (!session.data.user.type) {
        router.push("/");
      }
    }
  });

  return (
    <div className="container">
      <h1> Product List </h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Product ID</th>
            <th scope="col">Product Name</th>
            <th scope="col">Category</th>
            <th scope="col"> Image</th>
            <th scope="col">Stock Quantity</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {products && products.map((product) => {
            return (
              <tr key={product._id}>
                <th scope="row">{product._id}</th>
                <td>{product.name}</td>
                <td>{product.type}</td>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    width="100"
                    height="100"
                  />
                </td>
                <td>{product.stock_quantity}</td>
                <td>{product.price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
