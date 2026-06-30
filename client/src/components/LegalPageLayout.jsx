import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

const LegalPageLayout = ({ icon, title, subtitle, children }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-vicoba-dark dark:text-gray-100">
    <div className="max-w-3xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-vicoba-forest hover:text-vicoba-leaf transition-colors mb-8"
      >
        <FaArrowLeft size={12} /> Rudi Mwanzo
      </Link>

      <div className="flex items-center gap-4 mb-3">
        {icon && (
          <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-50 text-vicoba-forest flex items-center justify-center text-xl">
            {icon}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-8 sm:mb-10">{subtitle}</p>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm shadow-vicoba-forest/5 p-6 sm:p-10 space-y-8 prose-section">
        {children}
      </div>

      <p className="text-center text-gray-400 dark:text-gray-500 text-xs font-semibold mt-10">
        © {new Date().getFullYear()} Methynix Software. Haki zote zimehifadhiwa.
      </p>
    </div>
  </div>
);

export const Section = ({ title, children }) => (
  <section>
    <h2 className="text-base sm:text-lg font-extrabold text-vicoba-dark dark:text-gray-100 mb-2.5">{title}</h2>
    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed space-y-2.5">
      {children}
    </div>
  </section>
);

export default LegalPageLayout;
