import React from "react";
import Product from "./Product";

const ProductList = ({ products }) => {
  return (
    <section>
      <div className="container my-5">
        <header className="mb-4">
          <h3>Products</h3>
        </header>

        <div className="row">
          {products.map((product) => (
            <Product key={product.id} item={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
