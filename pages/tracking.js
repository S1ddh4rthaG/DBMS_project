import { signIn, signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function Tracking() {
  const session = useSession();
  const [track, setTrack] = useState({
    order_id: "",
    product_id: "",
  });

  const { data: trackingList, error } = useSWR("/api/tracking", fetcher);

  const handleSubmit = async (e, order_id, product_id) => {
    e.preventDefault();
    //send to /api/tracking
    const data = await fetcher("/api/tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: order_id,
        product_id: product_id,
      }),
    });
  };

  if (error) return <div>Failed to load</div>;
  if (!trackingList) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1> Tracking List</h1>
      {trackingList.tracking_grouped &&
        Object.keys(trackingList.tracking_grouped).map((key) => {
          return (
            <div className="border m-2 p-2" key={key}>
              <h2>Order ID: {key}</h2>
              {trackingList.tracking_grouped[key].map((item) => {
                return (
                  <div className="border m-2 p-2" key={item._id}>
                    {/* Advance to next location */}
                    <button
                      onClick={(e) => {
                        handleSubmit(e, item.order_id, item.product_id);
                      }}
                    >
                      Advance to next location
                    </button>
                    {/* Order id */}
                    <p>Order ID: {item.order_id}</p>
                    {/* Product id */}
                    <p>Product ID: {item.product_id}</p>
                    {/* user id */}
                    <p>User ID: {item.user_id}</p>
                    {/* current location */}
                    <p>Current Location: {item.current_location}</p>
                    {/* List of travel list */}
                    {
                      <div>
                        <p>Travel List</p>
                        {item.travel_list.map((travel) => {
                          return (
                            <div className="border m-2 p-2" key={travel._id}>
                              <p>Location: {travel.location}</p>
                            </div>
                          );
                        })}
                      </div>
                    }
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}
