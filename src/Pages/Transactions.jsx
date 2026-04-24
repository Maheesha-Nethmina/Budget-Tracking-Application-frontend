import React, { useState, useEffect, useMemo } from 'react';
import api from '../Service/api';
import Navbar from '../Components/Navbar';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ title: '', amount: '', type: '', transactionDate: new Date().toISOString().split('T')[0], categoryId: '', note: '' });
    const [editingId, setEditingId] = useState(null);
    const [filters, setFilters] = useState({ type: 'ALL', categoryId: 'ALL', sortBy: 'newest' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const username = JSON.parse(atob(token.split('.')[1])).sub;
            fetchCategories(username);
            fetchTransactions(username);
        } else { window.location.href = '/'; }
    }, []);

    const fetchCategories = async (username) => {
        const res = await api.get(`/categories/all/${username}`);
        setCategories(res.data);
    };

    const fetchTransactions = async (username) => {
        const res = await api.get(`/transactions/all/${username}`);
        setTransactions(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).sub;
        if (editingId) await api.put(`/transactions/edit/${editingId}/${username}`, formData);
        else await api.post(`/transactions/add/${username}`, formData);
        
        setEditingId(null);
        setFormData({ title: '', amount: '', type: '', transactionDate: new Date().toISOString().split('T')[0], categoryId: '', note: '' });
        fetchTransactions(username);
    };

    const handleDelete = async (id) => {
        const username = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).sub;
        if (window.confirm("Delete this transaction?")) {
            await api.delete(`/transactions/delete/${id}/${username}`);
            fetchTransactions(username);
        }
    };

    const filteredTransactions = useMemo(() => {
        let list = [...transactions].filter(tx => {
            const matchType = filters.type === 'ALL' || tx.type === filters.type;
            const matchCat = filters.categoryId === 'ALL' || tx.categoryId.toString() === filters.categoryId;
            return matchType && matchCat;
        });
        
        if (filters.sortBy === 'newest') list.sort((a,b) => new Date(b.transactionDate) - new Date(a.transactionDate));
        else if (filters.sortBy === 'oldest') list.sort((a,b) => new Date(a.transactionDate) - new Date(b.transactionDate));
        else if (filters.sortBy === 'highAmount') list.sort((a,b) => b.amount - a.amount);
        
        return list;
    }, [transactions, filters]);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* --- Sidebar (Consistent with Dashboard) --- */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shadow-sm z-10">
                <h2 className="text-xl font-bold text-indigo-600 mb-8 px-2">FinanceApp</h2>
                <nav className="flex flex-col gap-2">
                    <a href="/dashboard" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-3 rounded-lg transition">Dashboard</a>
                    <a href="/transactions" className="bg-indigo-50 text-indigo-600 font-medium py-2 px-3 rounded-lg transition">Transactions</a>
                    <a href="/categories" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-3 rounded-lg transition">Categories</a>
                </nav>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-1 overflow-y-auto">
                <Navbar isAuthenticated={true} onLogout={() => {localStorage.removeItem('token'); window.location.href='/';}} />
                
                <div className="p-8 max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800 mb-6">Manage Transactions</h1>

                    {/* Add/Edit Form */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                        <h2 className="text-md font-bold text-slate-700 mb-4">{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                            <input className="lg:col-span-1 p-2 border border-slate-200 rounded-lg" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            <input className="lg:col-span-1 p-2 border border-slate-200 rounded-lg" type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                            <select className="lg:col-span-1 p-2 border border-slate-200 rounded-lg" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required>
                                <option value="" disabled>Type</option>
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                            <select className="lg:col-span-1 p-2 border border-slate-200 rounded-lg" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                                <option value="" disabled>Category</option>
                                {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
                            </select>
                            <input className="lg:col-span-1 p-2 border border-slate-200 rounded-lg" type="date" value={formData.transactionDate} onChange={e => setFormData({...formData, transactionDate: e.target.value})} required />
                            <button className="bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">{editingId ? 'Update' : 'Save'}</button>
                        </form>
                    </div>

                    {/* Filter & Sort Bar */}
                    <div className="flex gap-4 mb-6">
                        <select className="p-2 border border-slate-200 rounded-lg text-sm" onChange={e => setFilters({...filters, type: e.target.value})}>
                            <option value="ALL">All Types</option>
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                        <select className="p-2 border border-slate-200 rounded-lg text-sm" onChange={e => setFilters({...filters, sortBy: e.target.value})}>
                            <option value="newest">Date: Newest</option>
                            <option value="oldest">Date: Oldest</option>
                            <option value="highAmount">Amount: High to Low</option>
                        </select>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr className="text-slate-500 text-xs uppercase">
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredTransactions.map(tx => (
                                    <tr key={tx.transactionId} className="hover:bg-slate-50 transition">
                                        <td className="p-4 text-sm text-slate-600">{tx.transactionDate}</td>
                                        <td className="p-4 font-bold text-slate-800">{tx.title}</td>
                                        <td className="p-4"><span className="px-3 py-1 bg-slate-100 rounded-full text-xs">{tx.categoryName}</span></td>
                                        <td className={`p-4 text-right font-bold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {tx.type === 'INCOME' ? '+' : '-'}${tx.amount}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => {setEditingId(tx.transactionId); setFormData(tx);}} className="text-indigo-600 font-semibold mr-4 hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(tx.transactionId)} className="text-red-500 font-semibold hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Transactions;