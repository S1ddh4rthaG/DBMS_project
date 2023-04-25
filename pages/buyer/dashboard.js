import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function ReturnResponse() {
  const session = useSession();
  const router = useRouter();

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
        <Link className="btn btn-primary ms-2 me-2" href="/buyer/dashboard">
          Dashboard
        </Link>
        <Link className="btn btn-primary ms-2 me-2" href="/buyer/return">
          Return
        </Link>
        <Link className="btn btn-primary ms-2 me-2" href="/buyer/cart">
          Cart
        </Link>
        <Link className="btn btn-primary ms-2 me-2" href="/buyer/orders">
          Orders
        </Link>
        <Link className="btn btn-primary ms-2 me-2" href="/buyer/return">
          Track Return
        </Link>
        <Link className="btn btn-primary ms-2 me-2" href="/buyer/track">
          Track Order
        </Link>
        <Link className="btn btn-primary ms-2 me-2" href="/buyer/checkout">
          Checkout
        </Link>
      </div>
    </div>
  );
}
