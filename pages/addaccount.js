import { useState } from "react";
import { getSession, useSession } from "next-auth/react";

import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";

const fetcher = (...args) => fetch(...args).then((r) => r.json());

export default function AddAccount() {
  const session = useSession();
  const router = useRouter();

  const { data: banksList, error } = useSWR("/api/payments/bank", fetcher);
  const banks = banksList ? banksList.banks : [];

  const [formData, setFormData] = useState({
    account_name: "",
    account_number: "",
    bank_id: "",
    balance: 0,
  });

  const { data: accountsList, errorAccounts } = useSWR(
    "/api/payments/account",
    fetcher
  );
  const accounts = accountsList ? accountsList.accounts : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const data = fetcher("/api/payments/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(data);
      mutate("/api/payments/account");
    } catch (err) {
      console.error(err.response.data);
    }
  };

  if (error) return <div>Failed to load banks</div>;
  if (!banks) return <div>Loading...</div>;

  if (errorAccounts) return <div>Failed to load accounts</div>;
  if (!accountsList) return <div>Loading...</div>;

  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 p-2 border rounded shadow-sm">
            <h4 className="text-center">Add Account</h4>
            <table className="table">
              <tbody>
                <tr>
                  <td>Account Name</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      name="account_name"
                      value={formData.account_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          account_name: e.target.value,
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>Account Number</td>
                  <td>
                    <input
                      type="text"
                      name="account_number"
                      className="form-control"
                      value={formData.account_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          account_number: e.target.value,
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>Bank</td>
                  <td>
                    <select
                      name="bank_id"
                      value={formData.bank_id}
                      className="form-control"
                      onChange={(e) =>
                        setFormData({ ...formData, bank_id: e.target.value })
                      }
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank._id} value={bank._id}>
                          {bank.bank_name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Balance</td>
                  <td>
                    <input
                      type="number"
                      name="balance"
                      className="form-control"
                      value={formData.balance}
                      onChange={(e) =>
                        setFormData({ ...formData, balance: e.target.value })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Add Account
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <h1>Accounts</h1>
          <table className="table border rounded">
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Account Number</th>
                <th>Bank</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.account_name}</td>
                  <td>{account.account_number}</td>
                  <td>{account.bank_id}</td>
                  <td>{account.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
