import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { getSession, useSession } from "next-auth/react";
import { Router, useRouter } from "next/router";
import Link from "next/link";
const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function AddBank() {
  const session = useSession();
  const router = useRouter();

  const { data: data, error } = useSWR("/api/admin/", fetcher);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="m-1">
        <h4>Admin Links</h4>
        <Link href="/admin/addbank" className="btn btn-primary">Add Bank</Link>
      </div>
      <h3>Statistics</h3>
      {/* Makae a vertical table */}
      <div className="row justify-content-center m-0">
        <div className="col-md-6 border shadow-sm rounded">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Total Sales</th>
                <th>Total Orders</th>
                <th>Total Site Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${data?.total_sales}</td>
                <td>{data?.total_orders}</td>
                <td>${data?.total_sales * 0.05}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
