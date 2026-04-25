import React from 'react';

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} FinanceApp. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 transition">Terms of Service</a>
          <a href="#" className="hover:text-indigo-600 transition">Support</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;