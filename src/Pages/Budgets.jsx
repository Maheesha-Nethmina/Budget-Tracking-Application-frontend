import React, { useState, useEffect } from 'react';
import api from '../Service/api';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Sidebar from '../Components/Sidebar'; 

function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentUsername, setCurrentUsername] = useState('');
    const [error, setError] = useState('');

    const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ categoryId: '', amount: '', period: selectedPeriod });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const username = JSON.parse(atob(token.split('.')[1])).sub;
            setCurrentUsername(username);
            fetchCategories(username);
            fetchBudgets(username, selectedPeriod);
        } else {
            window.location.href = '/';
        }
    }, [selectedPeriod]);

    const fetchCategories = async (username) => {
        try {
            const response = await api.get(`/categories/all/${username}`);
            const expenseCategories = response.data.filter(cat => cat.type === 'EXPENSE');
            setCategories(expenseCategories);
        } catch (err) { console.error("Failed to load categories"); }
    };

    const fetchBudgets = async (username, period) => {
        try {
            const response = await api.get(`/budgets/all/${username}/${period}`);
            setBudgets(response.data);
        } catch (err) { console.error("Failed to load budgets"); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = { ...formData, period: selectedPeriod };
            if (editingId) {
                await api.put(`/budgets/edit/${editingId}/${currentUsername}`, payload);
            } else {
                await api.post(`/budgets/add/${currentUsername}`, payload);
            }
            closeModal();
            fetchBudgets(currentUsername, selectedPeriod);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save budget");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this budget limit?")) {
            try {
                await api.delete(`/budgets/delete/${id}/${currentUsername}`);
                fetchBudgets(currentUsername, selectedPeriod);
            } catch (err) { alert("Failed to delete"); }
        }
    };

    const openModalForEdit = (budget) => {
        setEditingId(budget.budgetId);
        setFormData({ categoryId: budget.categoryId, amount: budget.amount, period: budget.period });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ categoryId: '', amount: '', period: selectedPeriod });
        setError('');
    };

    const getProgressDetails = (spent, total, isExceeded) => {
        const percentage = total > 0 ? (spent / total) * 100 : 0;
        const width = Math.min(percentage, 100) + '%';
        let colorClass = 'bg-emerald-500';
        if (isExceeded) colorClass = 'bg-rose-500';
        else if (percentage >= 80) colorClass = 'bg-amber-400';
        return { width, colorClass, percentage: percentage.toFixed(1) };
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar isAuthenticated={true} onLogout={() => { localStorage.removeItem('token'); window.location.href = '/'; }} />

            <div className="flex flex-1">
                <Sidebar activePage="budgets" />

                {/* Main Content */}
                <main className="flex-1 p-8 md:p-10">
                    <header className="mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Monthly Budgets</h1>
                            <p className="text-slate-500 mt-2">Set limits and track your spending progress.</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <input
                                type="month"
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="p-2 border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                            />
                            <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow-md transition">
                                + Set Budget
                            </button>
                        </div>
                    </header>

                    {/* Budgets Grid */}
                    {budgets.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm">
                            <p className="text-slate-500 font-medium">No budgets set for {selectedPeriod}.</p>
                            <button onClick={() => setIsModalOpen(true)} className="text-indigo-600 font-bold mt-2 hover:underline">Create one now</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            {budgets.map((b) => {
                                const { width, colorClass, percentage } = getProgressDetails(b.spentSoFar, b.amount, b.isExceeded);
                                return (
                                    <div key={b.budgetId} className={`bg-white p-6 rounded-xl border-2 shadow-sm transition-all ${b.isExceeded ? 'border-rose-300 bg-rose-50' : 'border-slate-100 hover:border-indigo-200'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800">{b.categoryName}</h3>
                                                {b.isExceeded && (
                                                    <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-full uppercase tracking-wider mt-1 inline-block">
                                                        Over Budget
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => openModalForEdit(b)} className="text-indigo-500 hover:text-indigo-800 text-sm font-bold">Edit</button>
                                                <button onClick={() => handleDelete(b.budgetId)} className="text-slate-400 hover:text-rose-600 text-sm font-bold">Delete</button>
                                            </div>
                                        </div>

                                        <div className="mb-2 flex justify-between items-end">
                                            <p className="text-2xl font-black text-slate-800">Rs.{b.spentSoFar.toFixed(2)}</p>
                                            <p className="text-sm font-semibold text-slate-500">of Rs.{b.amount.toFixed(2)}</p>
                                        </div>

                                        <div className="w-full bg-slate-200 rounded-full h-3 mb-2 overflow-hidden">
                                            <div className={`h-3 rounded-full transition-all duration-500 ${colorClass}`} style={{ width }}></div>
                                        </div>
                                        <p className="text-xs text-right font-bold text-slate-400">{percentage}% spent</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-xl">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{editingId ? 'Update Budget' : 'Set New Budget'}</h2>
                        {error && <p className="text-rose-500 text-sm mb-4 font-semibold p-2 bg-rose-50 rounded">{error}</p>}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                                <select
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    required
                                    disabled={editingId !== null}
                                >
                                    <option value="" disabled>Select Expense Category</option>
                                    {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Monthly Limit (Rs)</label>
                                <input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    placeholder="e.g. 500"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">Save Limit</button>
                                <button type="button" onClick={closeModal} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-300 transition">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default Budgets;