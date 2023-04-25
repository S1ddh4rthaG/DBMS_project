import { signIn, signOut, useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function Return() {
  const session = useSession();
  const { data: returnList, errorReturn } = useSWR(
    "/api/buyer/return",
    fetcher
  );
  const { data: orderList, errorOrder } = useSWR("/api/buyer/order", fetcher);
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
  const orders = orderList ? orderList.orders : [];
  console.log(orders);

  return (
    <div className="container">
      <h1>Order List</h1>
      {orders.map((order) => {
        return (
          <div className="m-2 p-2 shadow-sm border rounded" key={order._id}>
            <h4 className="p-2 shadow-sm border rounded-5 m-1">
              Order ID: {order._id}
            </h4>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Product Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Final Price</th>
                  <th scope="col">Return</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product) => {
                  return (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price}</td>
                      <td>{product.final_price}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleReturn(order._id, product.product_id)}
                        >
                          Return
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="row m-2">
              <div className="col-6 fs-4">
                <b>Total Price: </b>
                {order.total_price}
              </div>
              <div className="col-6 fs-4">
                <b>Order Status: </b>
                {order.status}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
