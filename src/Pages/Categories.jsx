import React, { useState, useEffect } from 'react';
import api from '../Service/api';
import Navbar from '../Components/Navbar';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', type: 'INCOME' });
  const [error, setError] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');

  const getUsernameFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const parsed = JSON.parse(decodedPayload);
      
      // Look for the username in either 'sub' or 'username' depending on your backend JWT setup
      const extractedUsername = parsed.sub || parsed.username;
      console.log("Decoded username from token:", extractedUsername); // Debugging line
      return extractedUsername; 
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
      console.error("No valid username found in token. Redirecting to login.");
      window.location.href = '/';
    }
  }, []);

  const fetchCategories = async (username) => {
    try {
      console.log(`Fetching categories for: ${username}`); // Debugging line
      const response = await api.get(`/categories/all/${username}`);
      setCategories(response.data);
    } catch (err) {
      // This will now print the EXACT reason it failed in your browser console
      console.error("Full Error Details:", err.response || err); 
      setError("Failed to fetch categories from the server.");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/categories/add/${currentUsername}`, newCategory);
      setNewCategory({ name: '', type: 'INCOME' }); 
      fetchCategories(currentUsername); 
    } catch (err) {
      console.error("Add Error:", err.response || err);
      setError(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.delete(`/categories/delete/${categoryId}/${currentUsername}`);
      fetchCategories(currentUsername); 
    } catch (err) {
      console.error("Delete Error:", err.response || err);
      alert("Failed to delete category");
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
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Manage Categories</h1>
            <p className="text-slate-500 mt-2">Create and organize your income and expense categories.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Add Category Form */}
            <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Add New Category</h2>
              {error && <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>}
              
              <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Groceries, Salary" 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newCategory.type}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                  >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition mt-2">
                  Add Category
                </button>
              </form>
            </div>

            {/* Categories List */}
            <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Your Categories</h2>
              
              {categories.length === 0 ? (
                <p className="text-slate-500">No categories found. Create one to get started!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.categoryId} className="flex justify-between items-center p-4 border border-slate-200 rounded-lg hover:border-indigo-200 transition">
                      <div>
                        <p className="font-bold text-slate-800">{cat.name}</p>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${cat.type === 'INCOME' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {cat.type}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDeleteCategory(cat.categoryId)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Categories;