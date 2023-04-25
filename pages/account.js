import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function Account() {
  const session = useSession();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (session && session.status === "authenticated") {
      setUser(session.data.user);
    } else {
      setUser({});
    }
  }, [session]);

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <h1 className="mb-4">Welcome, {user.name}!</h1>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th scope="row">Email</th>
                <td>{user.email_address}</td>
              </tr>
              <tr>
                <th scope="row">Phone</th>
                <td>{user.phone_number}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <div className="card border">
            <div className="card-body">
              <h5 className="card-title text-center">Address Details</h5>
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <th scope="row">Address Line 1</th>
                    <td>{user.address_line1}</td>
                  </tr>
                  <tr>
                    <th scope="row">Address Line 2</th>
                    <td>{user.address_line2}</td>
                  </tr>
                  <tr>
                    <th scope="row">Street</th>
                    <td>{user.street}</td>
                  </tr>
                  <tr>
                    <th scope="row">City</th>
                    <td>{user.city}</td>
                  </tr>
                  <tr>
                    <th scope="row">State</th>
                    <td>{user.state}</td>
                  </tr>
                  <tr>
                    <th scope="row">Pincode</th>
                    <td>{user.pincode}</td>
                  </tr>
                  <tr>
                    <th scope="row">Country</th>
                    <td>{user.country}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
