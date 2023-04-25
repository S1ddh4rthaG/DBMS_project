import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function ReturnResponse() {
  const session = useSession();
  const router = useRouter();

  const { data: returnTracksList, error } = useSWR(
    "/api/seller/return",
    fetcher
  );

  const returnTracks = returnTracksList ? returnTracksList.returnTracks : [];
  const { data: stats, errorStats } = useSWR("/api/seller/stats", fetcher);

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
      <h1>Links</h1>
      <div className="shadow-sm p-3 mb-5 bg-white border rounded">
        <Link className="btn btn-primary ms-2 me-2" href="/seller/dashboard">Dashboard</Link>
        <Link className="btn btn-primary ms-2 me-2" href="/seller/return">Return</Link>
        <Link className="btn btn-primary ms-2 me-2" href="/seller/additem">Add Item</Link>
        <Link className="btn btn-primary ms-2 me-2" href="/seller/inventory">Inventory</Link>
      </div>
      <h1>Stats</h1>
      {stats && (
        <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Total Sales</th>
                <th scope="col">Items Sold</th>
                <th scope="col">Total Returns</th>
                <th scope="col">Items Returned</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${stats.stats[0]}</td>
                <td>{stats.stats[1]}</td>
                <td>${stats.stats[2]}</td>
                <td>{stats.stats[3]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <h1>Returns</h1>
      <div className="shadow-sm p-3 mb-5 bg-white border rounded">
        {returnTracks &&
          returnTracks.map((returnTrack) => {
            return (
              <div key={returnTrack._id}>
                <h2>Return ID: {returnTrack._id}</h2>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Order ID</th>
                      <th scope="col">Product ID</th>
                      <th scope="col">Customer Name</th>
                      <th scope="col">Customer Email</th>
                      <th scope="col">Product Name</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Final Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{returnTrack.order_item_id.order_id}</td>
                      <td>{returnTrack.order_item_id.product_id}</td>
                      <td>{returnTrack.order_item_id.user_id.name}</td>
                      <td>{returnTrack.order_item_id.user_id.email_address}</td>
                      <td>{returnTrack.order_item_id.name}</td>
                      <td>{returnTrack.order_item_id.price}</td>
                      <td>{returnTrack.order_item_id.final_price}</td>
                    </tr>
                  </tbody>
                </table>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Return Path</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnTrack.travel_list.map((travel) => {
                      console.log(travel);
                      return (
                        <tr key={returnTrack._id}>
                          <td>{travel.location}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
      </div>
    </div>
  );
}
