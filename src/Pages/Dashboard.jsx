import React from 'react';

function Dashboard() {
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; 
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-indigo-600 mb-8">FinanceApp</h2>
          <nav className="flex flex-col gap-2">
            {/* Active Link */}
            <a href="#" className="bg-indigo-50 text-indigo-600 font-medium py-2 px-3 rounded-lg transition">
              Dashboard
            </a>
            {/* Inactive Links */}
            <a href="#" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-3 rounded-lg transition">
              Transactions
            </a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-3 rounded-lg transition">
              Budgets
            </a>
          </nav>
        </div>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="text-left text-red-500 font-semibold hover:text-red-700 hover:bg-red-50 py-2 px-3 rounded-lg transition"
        >
          Logout
        </button>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 md:p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, User</h1>
          <p className="text-slate-500 mt-2">Here is your financial overview.</p>
        </header>
        
        {/* Financial Summary section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Income</h3>
            <p className="text-3xl font-bold text-emerald-500">$5,000</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Expenses</h3>
            <p className="text-3xl font-bold text-rose-500">$3,200</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Balance</h3>
            <p className="text-3xl font-bold text-indigo-600">$1,800</p>
          </div>

        </section>
      </main>
    </div>
  );
}

export default Dashboard;