import React from 'react';

function Sidebar({ activePage }) {
    // Helper function to apply the correct CSS classes based on the active page
    const getLinkClass = (pageName) => {
        const baseClass = "font-medium py-2 px-3 rounded-lg transition";
        if (activePage === pageName) {
            return `bg-indigo-50 text-indigo-600 ${baseClass}`;
        }
        return `text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 ${baseClass}`;
    };

    return (
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shadow-sm">
            <nav className="flex flex-col gap-2">
                <a href="/dashboard" className={getLinkClass('dashboard')}>
                    Dashboard
                </a>
                <a href="/categories" className={getLinkClass('categories')}>
                    Categories
                </a>
                <a href="/transactions" className={getLinkClass('transactions')}>
                    Transactions
                </a>
                <a href="/budgets" className={getLinkClass('budgets')}>
                    Budgets
                </a>
            </nav>
        </aside>
    );
}

export default Sidebar;