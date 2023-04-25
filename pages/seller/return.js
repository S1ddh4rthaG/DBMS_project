import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function ReturnResponse() {
  const session = useSession();
  const router = useRouter();

  const { data: returnTracksList, error } = useSWR(
    "/api/seller/return",
    fetcher
  );
  const returnTracks = returnTracksList ? returnTracksList.returnTracks : [];

  // check if user in the session is authenticated
  useEffect(() => {
    if (session.status === "authenticated") {
      if (!session.data.user.type) {
        router.push("/");
      }
    }
  });

  const handleReturnResponse = async (returnTrackId, accept) => {
    fetcher("/api/seller/return", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        returnTrackId: returnTrackId,
        accept: accept,
      }),
    })
      .then((data) => {
        console.log(data);
        mutate("/api/seller/return");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container">
      <h1>Stashed for reponses</h1>

      {returnTracks.map((returnTrack) => {
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
            <p>
              <strong>Responded: {returnTrack.responded ? "Yes" : "No"}</strong>
            </p>
            <p>
              <strong>Accepted: {returnTrack.accepted ? "Yes" : "No"}</strong>
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                handleReturnResponse(returnTrack._id, false);
              }}
            >
              Accept
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                handleReturnResponse(returnTrack._id, true);
              }}
            >
              Reject
            </button>
          </div>
        );
      })}
    </div>
  );
}
