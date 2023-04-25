import { signIn, signOut, useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function Track() {
  const session = useSession();
  const { data: trackList, errorReturn } = useSWR("/api/buyer/track", fetcher);
  const tracks = trackList ? trackList.tracks : [];
  console.log(tracks);

  return (
    <div className="container">
      <h1>Track Order status</h1>
      {tracks.map((trackItem) => {
        return (
          <div className="m-2 p-2 shadow-sm border rounded" key={trackItem._id}>
            <h4 className="p-2 shadow-sm border rounded-5 m-1">
              Order ID: {trackItem.order_id && trackItem.order_id._id}
            </h4>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Product Name</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr key={trackItem.product_id._id}>
                  <td>{trackItem.product_id.name}</td>
                  <td>{trackItem.status}</td>
                </tr>
              </tbody>
            </table>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Travel</th>
                  <th scope="col">Arrived?</th>
                  <th scope="col">Left?</th>
                </tr>
              </thead>
              <tbody>
                {trackItem.travel_list.map((travel, i) => {
                  return (
                    <tr key={travel._id}>
                      <td>{travel.location}</td>
                      <td>
                        {trackItem.current_location >= i ? (
                          <i className="bi bi-check-circle-fill text-success"></i>
                        ) : (
                          <i className="bi bi-x-circle-fill text-muted"></i>
                        )}
                      </td>
                      <td>
                        {trackItem.current_location > i ? (
                          <i className="bi bi-check-circle-fill text-success"></i>
                        ) : (
                          <i className="bi bi-x-circle-fill text-muted"></i>
                        )}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  {trackItem.current_location >=
                  trackItem.travel_list.length ? (
                    <td colSpan="3">
                      <h4 className="text-success">Delivered</h4>
                    </td>
                  ) : (
                    <td colSpan="3">
                      <h4 className="text-muted">In Transit</h4>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
