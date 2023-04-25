import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import Loading from "./Loading";
export default function Navbar() {
  const session = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session.status === "authenticated") {
      setUser(session.user);
    }

    setLoading(false);
  }, [session]);

  return (
    <div className="navbar mb-3">
      <div className="d-flex flex-row ps-2 pe-2 align-items-center w-100">
        <Link href="/" className="btn btn-danger">
          QuickBuy
        </Link>
        <p className="flex-fill"></p>
        {session.status === "authenticated" ? (
          <div>
            <Link href="/buyer/cart" className="btn btn-primary ms-1 me-1">
              <i className="bi bi-cart fw-bold"></i>
            </Link>
            <Link href="/account" className="btn btn-primary ms-1 me-1">
              <i className="bi bi-person-circle fw-bold"></i>
            </Link>
            <Link href="/buyer/orders" className="btn btn-primary ms-1 me-1">
              <i className="bi bi-list fw-bold"></i>
            </Link>
            <Link href="/buyer/track" className="btn btn-primary ms-1 me-1">
              <i className="bi bi-truck fw-bold"></i>
            </Link>
            <Link href="/buyer/return" className="btn btn-primary ms-1 me-1">
              <i className="bi bi-arrow-return-left fw-bold"></i>
            </Link>
            <button
              className="btn btn-danger ms-1 me-1"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
        ) : (
          //Create a drop down menu for signup as buyer, seller, or advertiser
          <div>
            <div className="btn-group shadow-sm">
              <Link href="/buyer/signup" className="btn btn-primary me-1">
                Buyer
              </Link>
              <Link href="/seller/signup" className="btn btn-primary me-1">
                Seller
              </Link>
              <Link href="/advertiser/signup" className="btn btn-primary">
                Advertiser
              </Link>
            </div>

            <button
              className="btn btn-primary ms-1 me-1"
              onClick={() => signIn()}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
