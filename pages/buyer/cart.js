/* eslint-disable @next/next/no-img-element */
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import useSWR, { mutate } from "swr";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function Home() {
  const session = useSession();
  const { data: itemsList, error } = useSWR("/api/items", fetcher);
  const { data: cartList, errorCart } = useSWR("/api/buyer/cart", fetcher);

  const items = itemsList ? itemsList.items : [];
  const cart = cartList ? cartList.cart : [];

  const handleAddToCart = async (product_id, quantity) => {
    const res = await fetcher("/api/buyer/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id, quantity }),
    });
    console.log(res);
    mutate("/api/buyer/cart");
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

  if (error) return <div>Failed to load</div>;
  if (!itemsList) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>Cart</h2>
      <h5>Items in the cart: {cart ? cart.length : 0}</h5>
      <hr />
      {cart && cart.length === 0 ? (
        <h5 className="text-center">Your cart is empty</h5>
      ) : (
        <Link href="/buyer/checkout">
          <button className="btn btn-primary">Checkout</button>
        </Link>
      )}
      <div className="row">
        {cart.map((item) => {
          return (
            <div className="col-md-6 col-lg-3 mb-4" key={item._id}>
              <div className="card h-100">
                <img
                  src={item.product_item.image}
                  className="card-img-top"
                  alt={item.product_item.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.product_item.name}</h5>
                  <p className="card-text">{item.product_item.description}</p>
                  <table className="table table-borderless">
                    <tbody>
                      <tr className="m-0 p-0">
                        <td>
                          <b className="fs-6">Price:</b>
                        </td>
                        <td>${item.product_item.price}</td>
                      </tr>
                      <tr>
                        <td>
                          <b className="fs-6">Quantity:</b>
                        </td>
                        <td>{item.quantity}</td>
                      </tr>
                      <tr>
                        <td>
                          <b className="fs-6">Total:</b>
                        </td>
                        <td>${item.product_item.price * item.quantity}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveFromCart(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
