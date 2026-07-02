import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

const LegalPageLayout = ({ icon, title, subtitle, children }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lng', lng);
  };

  return (
    <div className="min-h-screen bg-vicoba-cream text-vicoba-dark">
      <header className="sticky top-0 z-30 bg-vicoba-cream border-b border-vicoba-dark/15">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-3.5 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-vicoba-forest hover:text-vicoba-leaf transition-colors"
          >
            <FaArrowLeft size={12} />
            <span className="font-serif italic">Methynix Umoja</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
            <button
              onClick={() => changeLanguage('sw')}
              className={i18n.language === 'sw' ? 'text-vicoba-forest' : 'text-vicoba-dark/40 hover:text-vicoba-dark'}
            >
              SW
            </button>
            <span className="text-vicoba-dark/20">/</span>
            <button
              onClick={() => changeLanguage('en')}
              className={i18n.language === 'en' ? 'text-vicoba-forest' : 'text-vicoba-dark/40 hover:text-vicoba-dark'}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-10 sm:py-14">
        <div className="flex items-center gap-4 mb-3">
          {icon && (
            <div className="w-12 h-12 shrink-0 bg-vicoba-forest/10 text-vicoba-forest flex items-center justify-center text-xl">
              {icon}
            </div>
          )}
          <h1 className="font-serif text-2xl sm:text-3xl text-vicoba-dark tracking-tight">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-xs text-vicoba-dark/50 font-semibold uppercase tracking-wide mb-8 sm:mb-10">{subtitle}</p>
        )}

        <div className="bg-white border border-vicoba-dark/10 shadow-sm p-6 sm:p-10 space-y-8">
          {children}
        </div>

        <p className="text-center text-vicoba-dark/40 text-xs font-semibold mt-8">
          © {new Date().getFullYear()} Methynix Software.
        </p>
      </div>
    </div>
  );
};

export const Section = ({ title, children }) => (
  <section>
    <h2 className="text-sm sm:text-base font-extrabold text-vicoba-dark mb-2.5 uppercase tracking-wide border-b border-vicoba-dark/10 pb-2">
      {title}
    </h2>
    <div className="text-sm text-vicoba-dark/70 font-medium leading-relaxed space-y-2.5">
      {children}
    </div>
  </section>
);

export default LegalPageLayout;
