import React from "react";
import Image from "next/image";
import Link from "next/link";

const Product = ({ item }) => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="card my-2 shadow-0">
        <Link href="#" className="img-wrap">
          <Image
            src={item.image}
            className="card-img-top"
            style={{ aspectRatio: "1 / 1" }}
            alt={item.name}
          ></Image>
        </Link>
        <div className="card-body p-0 pt-3">
          <Link
            href="#!"
            className="btn btn-light border px-2 pt-2 float-end icon-hover"
          >
            <i className="fas fa-plus fa-lg px-1 text-secondary"></i>
          </Link>
          <h5 className="card-title">${item.price}</h5>
          <p className="card-text mb-0">{item.name}</p>
          <p className="text-muted truncated">
            {item.description}
            <span className="d-block w-100">
              {item.stock_quantity} left in stock
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;
