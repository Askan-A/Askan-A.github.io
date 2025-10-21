/*
Folder structure suggestion:

smart-city-electric-bill-demo/
│
├── index.html         <-- main HTML file (login + dashboard)
├── assets/
│   └── (empty or optional images/icons)
├── style.css          <-- optional custom CSS if not using Tailwind CDN
└── README.md          <-- optional description

Below is the content for index.html (all-in-one with Tailwind CDN and JS logic).
*/

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Smart City Electric Bill Portal</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-slate-50 p-6">
<div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Left: Auth or Info -->
  <div class="p-4" id="leftPanel">
    <h1 class="text-2xl font-semibold mb-4">Smart City — Electric Bill Portal</h1>

    <form id="loginForm" class="space-y-4">
      <label class="block">
        <span class="text-sm">Email</span>
        <input type="email" id="email" required class="mt-1 block w-full rounded-md border p-2" placeholder="user@example.com">
      </label>
      <label class="block">
        <span class="text-sm">Password</span>
        <input type="password" id="password" required class="mt-1 block w-full rounded-md border p-2" placeholder="password">
      </label>
      <div id="error" class="text-red-600"></div>
      <button type="submit" class="px-4 py-2 rounded-lg bg-indigo-600 text-white">Login</button>
      <button type="button" id="fillDemo" class="px-3 py-2 rounded-lg border">Fill demo creds</button>
      <p class="mt-4 text-sm text-slate-600">Demo accounts: user@example.com / pass123 or raj@smartcity.com / raj2025</p>
    </form>

    <div id="userPanel" class="space-y-3 hidden"></div>
  </div>

  <!-- Right: Info & Global History -->
  <div class="p-4 border-l">
    <h3 class="text-lg font-semibold mb-3">Account & Payment Summary</h3>
    <div class="space-y-3">
      <div class="p-3 rounded-lg bg-slate-50">
        <h4 class="font-medium">Registered Users (demo)</h4>
        <ul class="mt-2 text-sm text-slate-700">
          <li class="mb-1"><span class="font-medium">Asha Patel</span> — user@example.com <span class="text-xs text-slate-500">(CCC-1001)</span></li>
          <li class="mb-1"><span class="font-medium">Raj Kumar</span> — raj@smartcity.com <span class="text-xs text-slate-500">(CCC-2077)</span></li>
        </ul>
      </div>
      <div class="p-3 rounded-lg bg-slate-50">
        <h4 class="font-medium">Global Recharge History</h4>
        <div id="globalHistory" class="mt-2 max-h-48 overflow-auto text-sm"></div>
      </div>
      <div class="text-xs text-slate-500">
        <p>Notes:</p>
        <ul class="list-disc ml-5">
          <li>This is a demo client app — no backend is called.</li>
          <li>Transactions are saved in your browser's localStorage.</li>
          <li>To reset demo data, clear site storage or open in Incognito mode.</li>
        </ul>
      </div>
    </div>
  </div>
</div>
<footer class="fixed left-4 bottom-4 text-xs text-slate-500">Demo app — not for production use</footer>

<script>
const SAMPLE_USERS = [
  {email: 'user@example.com', password: 'pass123', customerId: 'CCC-1001', name: 'Asha Patel', meter: 'MTR-908172'},
  {email: 'raj@smartcity.com', password: 'raj2025', customerId: 'CCC-2077', name: 'Raj Kumar', meter: 'MTR-118291'}
];
let user = null;
let transactions = JSON.parse(localStorage.getItem('smartcity_recharges')||'[]');

function renderGlobalHistory(){
  const container = document.getElementById('globalHistory');
  if(transactions.length===0){ container.innerHTML='<p class="text-sm text-slate-500 mt-2">No recharges made yet.</p>'; return;}
  let html='<table class="w-full text-sm"><thead class="text-slate-500 text-xs"><tr><th class="text-left">Date</th><th class="text-left">Customer</th><th class="text-right">Amt</th></tr></thead><tbody>';
  transactions.forEach(t=>{ html+=`<tr class="border-t"><td class="py-2">${new Date(t.date).toLocaleString()}</td><td class="py-2">${t.name} <span class="text-xs text-slate-400">(${t.customerId})</span></td><td class="py-2 text-right">₹${t.amount}</td></tr>`});
  html+='</tbody></table>';
  container.innerHTML=html;
}

function showUserPanel(){
  const panel = document.getElementById('userPanel');
  panel.innerHTML=`<div class="flex justify-between items-start"><div><h2 class="text-xl font-medium">Welcome, ${user.name}</h2><p class="text-sm text-slate-600">Customer ID: <span class="font-mono">${user.customerId}</span></p><p class="text-sm text-slate-600">Meter No: <span class="font-mono">${user.meter}</span></p></div><div><button id="logoutBtn" class="px-3 py-1 rounded-lg border">Logout</button></div></div><div class="p-3 border rounded-lg bg-slate-50 mt-3"><h3 class="font-semibold">Recharge Meter</h3><form id="rechargeForm" class="mt-2 flex gap-2 items-center"><input type="number" min="1" value="100" id="rechargeAmt" class="p-2 rounded-md border w-full"><button class="px-4 py-2 rounded-lg bg-emerald-600 text-white">Pay</button></form><p class="text-xs text-slate-500 mt-2">This demo simulates a successful recharge and stores history locally in your browser.</p><div id="rechargeError" class="text-red-600 mt-2"></div></div><div class="p-3 border rounded-lg mt-3"><h3 class="font-semibold">Last recharges (most recent)</h3><ul id="userTxList" class="mt-2 space-y-2 text-sm text-slate-700"></ul></div>`;

  document.getElementById('logoutBtn').onclick=()=>{ user=null; localStorage.removeItem('smartcity_auth_user'); document.getElementById('loginForm').style.display='block'; panel.classList.add('hidden'); };
  document.getElementById('rechargeForm').onsubmit=function(e){
    e.preventDefault();
    const amt=Number(document.getElementById('rechargeAmt').value);
    if(!amt||amt<=0){ document.getElementById('rechargeError').textContent='Enter valid amount'; return; }
    const tx={id:Date.now(), customerId:user.customerId, meter:user.meter, name:user.name, amount:amt, date:new Date().toISOString(), reference:`REF-${Math.random().toString(36).slice(2,9).toUpperCase()}`};
    transactions=[tx,...transactions];
    localStorage.setItem('smartcity_recharges', JSON.stringify(transactions));
    renderGlobalHistory();
    renderUserTx();
  };
  renderUserTx();
}

function renderUserTx(){
  const list = document.getElementById('userTxList');
  const userTx = transactions.filter(t=>t.customerId===user.customerId).slice(0,20);
  if(userTx.length===0){ list.innerHTML='<li class="text-sm text-slate-500">No previous recharges found.</li>'; return;}
  list.innerHTML = userTx.map(t=>`<li class="flex justify-between items-center"><div><div class="text-sm font-medium">₹${t.amount} — ${new Date(t.date).toLocaleString()}</div><div class="text-xs text-slate-500">Ref: ${t.reference}</div></div><div class="text-sm text-slate-600">Meter: ${t.meter}</div></li>`).join('');
}

// Login form
document.getElementById('loginForm').onsubmit=function(e){
  e.preventDefault();
  const email=document.getElementById('email').value;
  const password=document.getElementById('password').value;
  const found=SAMPLE_USERS.find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.password===password);
  if(!found){ document.getElementById('error').textContent='Invalid email or password.'; return; }
  user=found;
  localStorage.setItem('smartcity_auth_user', JSON.stringify(user));
  document.getElementById('loginForm').style.display='none';
  document.getElementById('userPanel').classList.remove('hidden');
  showUserPanel();
  document.getElementById('error').textContent='';
};

document.getElementById('fillDemo').onclick=function(){ document.getElementById('email').value='user@example.com'; document.getElementById('password').value='pass123'; };

// Restore session if any
const savedUser = localStorage.getItem('smartcity_auth_user');
if(savedUser){ user=JSON.parse(savedUser); document.getElementById('loginForm').style.display='none'; document.getElementById('userPanel').classList.remove('hidden'); showUserPanel(); }

renderGlobalHistory();
</script>
</body>
</html>
