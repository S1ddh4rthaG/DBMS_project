/* eslint-disable @next/next/no-img-element */
// Home Page
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function Home() {
  const session = useSession();
  const { data: itemsList, error } = useSWR("/api/items", fetcher);
  const { data: coupons, errorCoupons } = useSWR("/api/advertiser", fetcher);

  const [itemCount, setItemCount] = useState({});
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await fetcher(`/api/items?query=${query}`);
    setItems(data);
  };

  const handleItemChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setItemCount({
      ...itemCount,
      [name]: value,
    });
  };

  const handleAddToCart = async (product_id, quantity) => {
    if (!quantity) {
      quantity = 1;
    }

    const res = await fetcher("/api/buyer/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id, quantity }),
    });
  };

  console.log(session);

  if (error) return <div>Failed to load</div>;
  if (!itemsList) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="jumbotron jumbotron-fluid mt-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <h4 className="mb-4 text-center">Search for what you need!</h4>
              <div className="input-group d-flex flex-row mb-4 align-items-center">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search..."
                  aria-label="Search"
                  aria-describedby="search-button"
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary btn-lg ms-1"
                    type="button"
                    id="search-button"
                    onClick={(e) => handleSubmit(e)}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <h4>Generous Coupons from our advertisers</h4>
            {coupons &&
              coupons.coupons &&
              coupons.coupons.map((coupon) => {
                return (
                  <div className="col-md-2 fs-6" key={coupon._id}>
                    <div className="alert alert-success" role="alert">
                      <h6 className="alert-heading">{coupon.couponCode}</h6>
                      <p>{coupon.note}</p>
                      <p>DISCOUNT: {coupon.discount}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <br></br>
      <section className="text-center">
        {items && items.items ? (
          <h2 className="mb-5 font-weight-bold">
            Items matched using Similarity
          </h2>
        ) : null}
        <div className="row">
          {items &&
            items.items &&
            items.items.map((item) => {
              return (
                <div className="col-lg-2 col-md-4 col-sm-6 mb-4" key={item.id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={item.image}
                      className="card-img-top"
                      alt={item.name}
                      height="200"
                      width="100"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text text-left text-truncate">
                        {item.description}
                      </p>
                      <div className="d-flex flex-column justify-content-between align-items-center">
                        <p className="card-text mb-0">
                          <span className="fw-bold">Price:</span> ${item.price}
                        </p>
                        <div className="d-flex">
                          <input
                            type="number"
                            className="form-control me-2"
                            min="1"
                            max={item.stock_quantity}
                            name={item._id}
                            onChange={handleItemChange}
                            defaultValue="1"
                          />
                          <button
                            className="btn btn-outline-primary"
                            onClick={() =>
                              handleAddToCart(item._id, itemCount[item._id])
                            }
                          >
                            <i className="bi bi-cart-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      <br></br>
      <section className="text-center">
        {!items || !items.items ? (
          <h2 className="mb-5 font-weight-bold">Featured Items</h2>
        ) : null}
        <div className="row">
          {itemsList &&
            itemsList.items &&
            !items.items &&
            itemsList.items.map((item) => {
              return (
                <div className="col-lg-2 col-md-4 col-sm-6 mb-4" key={item.id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={item.image}
                      className="card-img-top"
                      alt={item.name}
                      height="200"
                      width="100"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text text-left text-truncate">
                        {item.description}
                      </p>
                      <div className="d-flex flex-column justify-content-between align-items-center">
                        <p className="card-text mb-0">
                          <span className="fw-bold">Price:</span> ${item.price}
                        </p>
                        <div className="d-flex">
                          <input
                            type="number"
                            className="form-control me-2"
                            min="1"
                            max={item.stock_quantity}
                            name={item._id}
                            onChange={handleItemChange}
                            defaultValue="1"
                          />
                          <button
                            className="btn btn-outline-primary"
                            onClick={() =>
                              handleAddToCart(item._id, itemCount[item._id])
                            }
                          >
                            <i className="bi bi-cart-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}
