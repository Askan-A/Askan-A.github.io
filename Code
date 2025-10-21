import React, { useState, useEffect } from "react";

// Smart City Electric Bill — Single-file React app
// - Login with email & password (mocked users)
// - Shows Customer ID, Name, Meter Number
// - Shows previous recharge amounts and dates
// - Allows recharging the meter (simulated) and stores history in localStorage
// - Uses Tailwind classes for styling (no external libs required)

export default function App() {
  const SAMPLE_USERS = [
    {
      email: "user@example.com",
      password: "pass123",
      customerId: "CCC-1001",
      name: "Asha Patel",
      meter: "MTR-908172",
    },
    {
      email: "raj@smartcity.com",
      password: "raj2025",
      customerId: "CCC-2077",
      name: "Raj Kumar",
      meter: "MTR-118291",
    },
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(100);
  const [transactions, setTransactions] = useState([]);

  // keys in localStorage
  const TX_KEY = "smartcity_recharges";
  const AUTH_KEY = "smartcity_auth_user";

  useEffect(() => {
    // restore session
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      } catch (e) {
        // ignore
      }
    }

    // load transactions
    const tx = localStorage.getItem(TX_KEY);
    if (tx) {
      try {
        setTransactions(JSON.parse(tx));
      } catch (e) {
        setTransactions([]);
      }
    }
  }, []);

  useEffect(() => {
    // persist transactions
    localStorage.setItem(TX_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  }, [user]);

  function handleLogin(e) {
    e.preventDefault();
    setError("");
    const found = SAMPLE_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      setError("Invalid email or password. Try user@example.com / pass123");
      return;
    }
    setUser(found);
  }

  function handleLogout() {
    setUser(null);
    setEmail("");
    setPassword("");
  }

  function handleRecharge(e) {
    e.preventDefault();
    setError("");
    if (!user) return setError("You must be logged in to recharge.");
    const amt = Number(amount);
    if (!amt || amt <= 0) return setError("Enter a valid recharge amount.");

    const newTx = {
      id: Date.now(),
      customerId: user.customerId,
      meter: user.meter,
      name: user.name,
      amount: amt,
      date: new Date().toISOString(),
      reference: `REF-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
  }

  const userTx = user
    ? transactions.filter((t) => t.customerId === user.customerId).slice(0, 20)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Auth or Info */}
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-4">Smart City — Electric Bill Portal</h1>

          {!user ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="text-sm">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border p-2"
                  placeholder="user@example.com"
                />
              </label>

              <label className="block">
                <span className="text-sm">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border p-2"
                  placeholder="password"
                />
              </label>

              {error && <div className="text-red-600">{error}</div>}

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Login</button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("user@example.com");
                    setPassword("pass123");
                  }}
                  className="px-3 py-2 rounded-lg border"
                >
                  Fill demo creds
                </button>
              </div>

              <p className="mt-4 text-sm text-slate-600">Demo accounts: user@example.com / pass123 or raj@smartcity.com / raj2025</p>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-medium">Welcome, {user.name}</h2>
                  <p className="text-sm text-slate-600">Customer ID: <span className="font-mono">{user.customerId}</span></p>
                  <p className="text-sm text-slate-600">Meter No: <span className="font-mono">{user.meter}</span></p>
                </div>
                <div>
                  <button onClick={handleLogout} className="px-3 py-1 rounded-lg border">Logout</button>
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-slate-50">
                <h3 className="font-semibold">Recharge Meter</h3>
                <form onSubmit={handleRecharge} className="mt-2 flex gap-2 items-center">
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="p-2 rounded-md border w-full"
                  />
                  <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Pay</button>
                </form>
                <p className="text-xs text-slate-500 mt-2">This demo simulates a successful recharge and stores history locally in your browser.</p>
                {error && <div className="text-red-600 mt-2">{error}</div>}
              </div>

              <div className="p-3 border rounded-lg">
                <h3 className="font-semibold">Last recharges (most recent)</h3>
                {userTx.length === 0 ? (
                  <p className="text-sm text-slate-500 mt-2">No previous recharges found.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {userTx.map((t) => (
                      <li key={t.id} className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium">₹{t.amount} — {new Date(t.date).toLocaleString()}</div>
                          <div className="text-xs text-slate-500">Ref: {t.reference}</div>
                        </div>
                        <div className="text-sm text-slate-600">Meter: {t.meter}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Info & Global History */}
        <div className="p-4 border-l">
          <h3 className="text-lg font-semibold mb-3">Account & Payment Summary</h3>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-50">
              <h4 className="font-medium">Registered Users (demo)</h4>
              <ul className="mt-2 text-sm text-slate-700">
                {SAMPLE_USERS.map((u) => (
                  <li key={u.email} className="mb-1">
                    <span className="font-medium">{u.name}</span> — {u.email} <span className="text-xs text-slate-500">({u.customerId})</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-slate-50">
              <h4 className="font-medium">Global Recharge History</h4>
              {transactions.length === 0 ? (
                <p className="text-sm text-slate-500 mt-2">No recharges made yet in this browser.</p>
              ) : (
                <div className="mt-2 max-h-48 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="text-slate-500 text-xs">
                      <tr>
                        <th className="text-left">Date</th>
                        <th className="text-left">Customer</th>
                        <th className="text-right">Amt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id} className="border-t">
                          <td className="py-2">{new Date(t.date).toLocaleString()}</td>
                          <td className="py-2">{t.name} <span className="text-xs text-slate-400">({t.customerId})</span></td>
                          <td className="py-2 text-right">₹{t.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-500">
              <p>Notes:</p>
              <ul className="list-disc ml-5">
                <li>This is a demo single-file client app — no external backend is called.</li>
                <li>Transactions are saved in your browser's localStorage under the key <span className="font-mono">{TX_KEY}</span>.</li>
                <li>To reset demo data, clear site storage or open in an Incognito window.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <footer className="fixed left-4 bottom-4 text-xs text-slate-500">Demo app — not for production use</footer>
    </div>
  );
}
