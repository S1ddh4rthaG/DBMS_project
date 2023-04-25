import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function AdvertiserSignup() {
  const session = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email_address: "",
    password: "",
    phone_number: "",
    street: "",
    address_line1: "",
    address_line2: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch("/api/register/advertiser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (data.success) {
      router.push("/login");
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return session.status === "authenticated" ? (
    <div>
      <h1>Already logged in</h1>
      <Link href="/">Go To Home
      </Link>
    </div>
  ) : (
    <div class="container w-50 mb-5 mt-5">
      <form onSubmit={handleSubmit} className="p-2 rounded-4 shadow">
        <h2 class="mb-5 text-center">Advertiser Signup</h2>
        <div class="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            class="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div class="form-group">
          <label htmlFor="email_address">Email Address</label>
          <input
            type="email"
            id="email_address"
            name="email_address"
            class="form-control"
            value={formData.email_address}
            onChange={handleChange}
            required
          />
        </div>
        <div class="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div class="form-group">
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            class="form-control"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>
        <div class="form-group">
          <label htmlFor="street">Street</label>
          <input
            type="text"
            id="street"
            name="street"
            class="form-control"
            value={formData.street}
            onChange={handleChange}
            required
          />
        </div>
        <div class="form-group">
          <label htmlFor="address_line1">Address Line 1</label>
          <input
            type="text"
            id="address_line1"
            name="address_line1"
            class="form-control"
            value={formData.address_line1}
            onChange={handleChange}
            required
          />
        </div>
        <div class="form-group">
          <label htmlFor="address_line2">Address Line 2</label>
          <input
            type="text"
            id="address_line2"
            name="address_line2"
            class="form-control"
            value={formData.address_line2}
            onChange={handleChange}
          />
        </div>
        <div class="form-group">
          <label htmlFor="pincode">Pincode</label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            class="form-control"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
        </div>
        <div class="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            class="form-control"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div class="form-group">
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            class="form-control"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div class="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            class="form-control"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-success mt-1 w-25">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
