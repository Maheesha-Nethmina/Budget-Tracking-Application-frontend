import React from 'react';
import Navbar from '../Components/Navbar';

function Dashboard() {
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; 
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      
      {/* Top Navigation Bar */}
      <Navbar 
        isAuthenticated={true} 
        onLogout={handleLogout} 
      />

      {/* Lower Section containing Sidebar and Main Content */}
      <div className="flex flex-1">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <nav className="flex flex-col gap-2">
              <a href="/dashboard" className="bg-indigo-50 text-indigo-600 font-medium py-2 px-3 rounded-lg transition">
                Dashboard
              </a>
              <a href="/transactions" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-3 rounded-lg transition">
                Transactions
              </a>
              <a href="/categories" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-3 rounded-lg transition">
                Categories
              </a>
              <a href="/budgets" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-3 rounded-lg transition">
                Budgets
              </a>
            </nav>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-8 md:p-10">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-slate-800">Welcome back</h1>
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
    </div>
  );
}

export default Dashboard;