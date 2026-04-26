import React, { useState, useEffect } from 'react';
import api from '../Service/api';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Sidebar from '../Components/Sidebar'; 
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

function Dashboard() {
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    currentBalance: 0,
    recentTransactions: [],
    expenseByCategoryData: [],
    monthlyData: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Colors for  Pie Chart
  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#3b82f6'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        const username = JSON.parse(atob(token.split('.')[1])).sub;
        fetchDashboardData(username);
    } else {
        window.location.href = '/';
    }
  }, []);

  const fetchDashboardData = async (username) => {
    try {
        const res = await api.get(`/dashboard/${username}`);
        setData(res.data);
        setIsLoading(false);
    } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; 
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-indigo-600 font-bold text-xl">Loading Dashboard Overview...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      
      {/* Top Navigation Bar */}
      <Navbar 
        isAuthenticated={true} 
        onLogout={handleLogout} 
      />

      <div className="flex flex-1">
        
        <Sidebar activePage="dashboard" />
        
        {/* Main Content */}
        <main className="flex-1 p-8 md:p-10 overflow-y-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-slate-800">Welcome back</h1>
            <p className="text-slate-500 mt-2">Here is your financial overview.</p>
          </header>
          
          {/* Financial Summary section */}
          <section className="grid grid-cols-3 gap-4 lg:gap-6 mb-10">
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Income</h3>
              <p className="text-xl md:text-3xl font-bold text-emerald-500">+Rs.{data.totalIncome.toFixed(2)}</p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Expenses</h3>
              <p className="text-xl md:text-3xl font-bold text-rose-500">-Rs.{data.totalExpenses.toFixed(2)}</p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Balance</h3>
              <p className={`text-xl md:text-3xl font-bold ${data.currentBalance >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                Rs.{data.currentBalance.toFixed(2)}
              </p>
            </div>
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-2 gap-6 lg:gap-8 mb-10">
            
            {/* Monthly Income vs Expenses Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Monthly Income vs. Expenses</h3>
                <div className="h-72">
                    {data.monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                                <YAxis tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                                <Legend iconType="circle" wrapperStyle={{fontSize: '14px', paddingTop: '10px'}} />
                                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">No data available</div>
                    )}
                </div>
            </div>

            {/* Expense Distribution Pie Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Expense Distribution</h3>
                <div className="h-72">
                    {data.expenseByCategoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{fontSize: '14px'}}/>
                                <Pie 
                                    data={data.expenseByCategoryData} 
                                    cx="40%" cy="50%" 
                                    innerRadius={60} outerRadius={90} 
                                    paddingAngle={5} dataKey="value"
                                >
                                    {data.expenseByCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">No expenses recorded</div>
                    )}
                </div>
            </div>
          </section>

          {/* Recent Transactions List */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
                  <a href="/transactions" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">View All &rarr;</a>
              </div>
              {data.recentTransactions.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                      {data.recentTransactions.map((tx) => (
                          <div key={tx.transactionId} className="py-4 flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl ${tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                      {tx.type === 'INCOME' ? '+' : '-'}
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-800">{tx.title}</p>
                                      <p className="text-xs text-slate-500">{tx.transactionDate} • {tx.categoryName}</p>
                                  </div>
                              </div>
                              <p className={`font-black ${tx.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                              </p>
                          </div>
                      ))}
                  </div>
              ) : (
                  <p className="text-slate-500 text-center py-4">No recent transactions.</p>
              )}
          </section>

        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;