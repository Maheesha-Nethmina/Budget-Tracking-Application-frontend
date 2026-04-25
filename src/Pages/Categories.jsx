import React, { useState, useEffect } from 'react';
import api from '../Service/api';
import Navbar from '../Components/Navbar';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  
  // Define the exact categories from the assignment
  const INCOME_OPTIONS = ['Salary', 'Freelance', 'Investments'];
  const EXPENSE_OPTIONS = ['Food', 'Transport', 'Rent', 'Entertainment'];

  // Default to the first Income option
  const [newCategory, setNewCategory] = useState({ name: INCOME_OPTIONS[0], type: 'INCOME' });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New State for Editing
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', type: 'INCOME' });

  const getUsernameFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const parsed = JSON.parse(decodedPayload);
      return parsed.sub || parsed.username; 
    } catch (err) {
      console.error("Failed to decode token", err);
      return null;
    }
  };

  useEffect(() => {
    const dynamicUsername = getUsernameFromToken();
    if (dynamicUsername) {
      setCurrentUsername(dynamicUsername);
      fetchCategories(dynamicUsername);
    } else {
      window.location.href = '/';
    }
  }, []);

  const fetchCategories = async (username) => {
    try {
      const response = await api.get(`/categories/all/${username}`);
      setCategories(response.data);
    } catch (err) {
      setError("Failed to fetch categories from the server.");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/categories/add/${currentUsername}`, newCategory);
      setNewCategory({ name: INCOME_OPTIONS[0], type: 'INCOME' }); // Reset to default
      setIsModalOpen(false); 
      fetchCategories(currentUsername); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
        try {
            await api.delete(`/categories/delete/${categoryId}/${currentUsername}`);
            fetchCategories(currentUsername); 
        } catch (err) {
            alert("Failed to delete category");
        }
    }
  };

  const startEditing = (category) => {
    setEditingId(category.categoryId);
    setEditFormData({ name: category.name, type: category.type });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFormData({ name: '', type: 'INCOME' });
  };

  const handleUpdateCategory = async (categoryId) => {
    try {
      await api.put(`/categories/edit/${categoryId}/${currentUsername}`, editFormData);
      setEditingId(null); 
      fetchCategories(currentUsername); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; 
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar isAuthenticated={true} onLogout={handleLogout} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
          <nav className="flex flex-col gap-2">
            <a href="/dashboard" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-3 rounded-lg transition">
              Dashboard
            </a>
            <a href="/transactions" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-3 rounded-lg transition">
              Transactions
            </a>
            <a href="/categories" className="bg-indigo-50 text-indigo-600 font-medium py-2 px-3 rounded-lg transition">
              Categories
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 md:p-10">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Manage Categories</h1>
              <p className="text-slate-500 mt-2">Create and organize your income and expense categories.</p>
            </div>
            {/* ADD BUTTON */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow-md transition"
            >
                + Add Category
            </button>
          </header>

          {/* Categories List */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            {categories.length === 0 ? (
                <p className="text-slate-500">No categories found. Create one to get started!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.categoryId} className="p-4 border border-slate-200 rounded-lg hover:border-indigo-200 transition bg-slate-50">
                      
                      {editingId === cat.categoryId ? (
                        <div className="flex flex-col gap-2">
                          {/* EDIT FORM: Type Dropdown */}
                          <select 
                            className="w-full p-1 border border-slate-300 rounded"
                            value={editFormData.type}
                            onChange={(e) => {
                                const selectedType = e.target.value;
                                setEditFormData({ 
                                    type: selectedType, 
                                    name: selectedType === 'INCOME' ? INCOME_OPTIONS[0] : EXPENSE_OPTIONS[0] 
                                });
                            }}
                          >
                            <option value="INCOME">INCOME</option>
                            <option value="EXPENSE">EXPENSE</option>
                          </select>

                          {/* EDIT FORM: Category Name Dropdown */}
                          <select 
                            className="w-full p-1 border border-slate-300 rounded"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          >
                            {(editFormData.type === 'INCOME' ? INCOME_OPTIONS : EXPENSE_OPTIONS).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleUpdateCategory(cat.categoryId)} className="bg-emerald-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-emerald-600">Save</button>
                            <button onClick={cancelEditing} className="bg-slate-300 text-slate-700 px-3 py-1 rounded text-sm font-semibold hover:bg-slate-400">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-800">{cat.name}</p>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${cat.type === 'INCOME' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {cat.type}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => startEditing(cat)} className="text-indigo-500 hover:text-indigo-700 p-2 text-sm font-semibold">Edit</button>
                            <button onClick={() => handleDeleteCategory(cat.categoryId)} className="text-red-500 hover:text-red-700 p-2 text-sm font-semibold">Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
            )}
          </div>
        </main>
      </div>

      {/* --- ADD CATEGORY MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-xl">
                <h2 className="text-xl font-bold text-slate-800 mb-6">New Category</h2>
                {error && <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>}
                
                <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                        <select 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={newCategory.type}
                            onChange={(e) => {
                                const selectedType = e.target.value;
                                setNewCategory({ 
                                    type: selectedType, 
                                    name: selectedType === 'INCOME' ? INCOME_OPTIONS[0] : EXPENSE_OPTIONS[0] 
                                });
                            }}
                        >
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
                        {/* Replaced Text Input with Select Dropdown */}
                        <select 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            required
                        >
                            {(newCategory.type === 'INCOME' ? INCOME_OPTIONS : EXPENSE_OPTIONS).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            Add Category
                        </button>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-300 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

export default Categories;