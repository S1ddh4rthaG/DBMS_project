import { signIn, signOut, useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function Return() {
  const session = useSession();
  const { data: returnList, errorReturn } = useSWR(
    "/api/buyer/return",
    fetcher
  );
  const handleReturn = (order_id, product_id) => {
    console.log(order_id, product_id);
    fetcher("/api/buyer/return", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: order_id,
        product_id: product_id,
      }),
    });
    mutate("/api/buyer/return");
  };
  const returns = returnList ? returnList.returns : [];
  const return_paths = returnList ? returnList.return_paths : [];
  console.log(returns);

  return (
    <div className="container">
      <h1>Return List</h1>
      {returns.map((returnItem, i) => {
        return (
          <div
            className="m-2 p-2 shadow-sm border rounded"
            key={returnItem._id}
          >
            <h4 className="p-2 shadow-sm border rounded-5 m-1">
              Return ID: {returnItem._id}
            </h4>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Product Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Final Price</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr key={returnItem._id}>
                  <td>{returnItem.name}</td>
                  <td>{returnItem.quantity}</td>
                  <td>{returnItem.price}</td>
                  <td>{returnItem.final_price}</td>
                  <td>{returnItem.status}</td>
                </tr>
              </tbody>
            </table>
            <table className="table">
              <thead>
                <tr>
                  <th>Path</th>
                </tr>
              </thead>
              <tbody>
                {return_paths[i] &&
                  return_paths[i].travel_list &&
                  return_paths[i].travel_list.map((travel) => {
                    return (
                      <tr key={travel._id}>
                        <td>{travel.location}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="d-flex justify-content-end">
              <p>
                {return_paths[i] && !return_paths[i].responded ? (
                  <p>
                    <span className="badge bg-info h-25">
                      Waiting for seller response
                      <pre>{JSON.stringify(returnItem.responded)}</pre>
                    </span>
                  </p>
                ) : return_paths[i] && return_paths[i].return_rejected ? (
                  <span className="text-danger">Return Rejected</span>
                ) : (
                  <span className="text-success">Return Accepted</span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
