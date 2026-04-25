import React, { useState, useEffect, useMemo } from 'react';
import api from '../Service/api';
import Navbar from '../Components/Navbar';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ title: '', amount: '', type: '', transactionDate: new Date().toISOString().split('T')[0], categoryId: '', note: '' });
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Filters State
    const [filters, setFilters] = useState({ 
        type: 'ALL', 
        categoryId: 'ALL', 
        startDate: '', 
        endDate: '',
        sortBy: 'newest' 
    });

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
        
        setIsModalOpen(false);
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

    // Reset all filters
    const clearFilters = () => {
        setFilters({ type: 'ALL', categoryId: 'ALL', startDate: '', endDate: '', sortBy: 'newest' });
    };

    const filteredTransactions = useMemo(() => {
        return [...transactions].filter(tx => {
            const matchType = filters.type === 'ALL' || tx.type === filters.type;
            const matchCat = filters.categoryId === 'ALL' || tx.categoryId.toString() === filters.categoryId;
            const matchStart = !filters.startDate || tx.transactionDate >= filters.startDate;
            const matchEnd = !filters.endDate || tx.transactionDate <= filters.endDate;
            return matchType && matchCat && matchStart && matchEnd;
        }).sort((a,b) => {
            if (filters.sortBy === 'newest') return new Date(b.transactionDate) - new Date(a.transactionDate);
            if (filters.sortBy === 'oldest') return new Date(a.transactionDate) - new Date(b.transactionDate);
            return 0;
        });
    }, [transactions, filters]);

    // Helper to truncate notes
    const truncateNote = (note) => {
        if (!note) return "";
        return note.length > 20 ? note.substring(0, 20) + "..." : note;
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar isAuthenticated={true} onLogout={() => {localStorage.removeItem('token'); window.location.href='/';}} />

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shadow-sm">
                    <nav className="flex flex-col gap-2">
                        <a href="/dashboard" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-3 rounded-lg transition">Dashboard</a>
                        <a href="/transactions" className="bg-indigo-50 text-indigo-600 font-medium py-2 px-3 rounded-lg transition">Transactions</a>
                        <a href="/categories" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-3 rounded-lg transition">Categories</a>
                        <a href="/budgets" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-3 rounded-lg transition">Budgets</a>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">Manage Transactions</h1>
                        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow-md">
                            + Add Transaction
                        </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
                        <span className="text-sm font-semibold text-slate-500 uppercase">Filters:</span>
                        <select className="p-2 border rounded-lg text-sm" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
                            <option value="ALL">All Types</option>
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                        <select className="p-2 border rounded-lg text-sm" value={filters.categoryId} onChange={e => setFilters({...filters, categoryId: e.target.value})}>
                            <option value="ALL">All Categories</option>
                            {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
                        </select>
                        <input type="date" className="p-2 border rounded-lg text-sm" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} />
                        <input type="date" className="p-2 border rounded-lg text-sm" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} />
                        
                        {/* New Clear Button */}
                        <button onClick={clearFilters} className="ml-auto bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition">
                            Clear Filters
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="p-4 text-xs uppercase text-slate-500">Date</th>
                                    <th className="p-4 text-xs uppercase text-slate-500">Title & Note</th>
                                    <th className="p-4 text-xs uppercase text-slate-500">Category</th>
                                    <th className="p-4 text-xs uppercase text-slate-500 text-right">Amount</th>
                                    <th className="p-4 text-xs uppercase text-slate-500 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredTransactions.map(tx => (
                                    <tr key={tx.transactionId} className="hover:bg-slate-50 transition">
                                        <td className="p-4 text-sm text-slate-600">{tx.transactionDate}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{tx.title}</div>
                                            {tx.note && <div className="text-xs text-slate-400">{truncateNote(tx.note)}</div>}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{tx.categoryName}</td>
                                        <td className={`p-4 text-right font-bold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {tx.type === 'INCOME' ? '+' : '-'}${tx.amount}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => {setEditingId(tx.transactionId); setFormData(tx); setIsModalOpen(true);}} className="text-indigo-600 font-semibold mr-4 hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(tx.transactionId)} className="text-red-500 font-semibold hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                            <input className="p-3 border rounded-lg" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            <input className="p-3 border rounded-lg" type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                            <select className="p-3 border rounded-lg" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required>
                                <option value="" disabled>Type</option>
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                            <select className="p-3 border rounded-lg" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                                <option value="" disabled>Category</option>
                                {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
                            </select>
                            <input className="p-3 border rounded-lg" type="date" value={formData.transactionDate} onChange={e => setFormData({...formData, transactionDate: e.target.value})} required />
                            <textarea className="p-3 border rounded-lg" placeholder="Optional note" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
                            
                            <div className="flex gap-3 mt-4">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white p-3 rounded-lg font-bold">Save</button>
                                <button type="button" onClick={() => {setIsModalOpen(false); setEditingId(null);}} className="flex-1 bg-slate-200 p-3 rounded-lg font-bold">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Transactions;