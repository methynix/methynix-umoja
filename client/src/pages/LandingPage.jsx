import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPiggyBank, FaMoneyBillWave, FaUsers, FaMobileScreen, FaWhatsapp, FaArrowRight } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import heroBg from '/hero-vicoba.jpg';
import { DEV_PHONE, DEV_WHATSAPP } from '../utils/contact';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lng', lng);
  };

  const handleInstall = async () => {
    if (!installPrompt) {
      toast(t('install_hint'), { duration: 6000 });
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  return (
    <div className="min-h-screen bg-vicoba-cream text-vicoba-dark">
      <header className="sticky top-0 z-30 bg-vicoba-cream border-b border-vicoba-dark/15">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-4 ">
          <img src="/VICOBA.png" className="h-9 w-11 "/>
           <span className="font-serif text-lg font-medium tracking-tight text-vicoba-dark">
            Methynix <span className="italic text-vicoba-forest">Umoja</span>
          </span>
        </div>
         
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs sm:text-[13px] font-semibold uppercase tracking-wide">
              <Link to="/support-us" className="text-vicoba-forest hover:text-vicoba-gold transition-colors">{t('nav_support')}</Link>
              <Link to="/terms" className="text-vicoba-dark/60 hover:text-vicoba-dark transition-colors">{t('nav_terms')}</Link>
              <Link to="/privacy-policy" className="text-vicoba-dark/60 hover:text-vicoba-dark transition-colors">{t('nav_privacy')}</Link>
            </nav>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide border-l border-vicoba-dark/15 pl-5">
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
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-24 grid lg:grid-cols-12 gap-x-12 gap-y-12 items-center">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-vicoba-gold"></span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-vicoba-gold">
              {t('landing_eyebrow')}
            </span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[4.5rem] leading-[0.98] text-vicoba-dark mb-7">
            Methynix<br /><span className="italic text-vicoba-forest">Umoja</span> Vikoba
          </h1>

          <p className="text-base sm:text-lg text-vicoba-dark/70 max-w-lg leading-relaxed font-medium mb-10">
            {t('landing_lead')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 bg-vicoba-forest text-vicoba-cream font-bold text-sm uppercase tracking-wide border-2 border-vicoba-dark shadow-[3px_3px_0_0_#2E302E] hover:shadow-[1px_1px_0_0_#2E302E] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {t('landing_cta')}
            </button>
            <button
              onClick={handleInstall}
              className="px-7 py-3.5 bg-vicoba-cream text-vicoba-dark font-bold text-sm uppercase tracking-wide border-2 border-vicoba-dark shadow-[3px_3px_0_0_#2E302E] hover:shadow-[1px_1px_0_0_#2E302E] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
            >
              <FaMobileScreen size={14} />
              {t('landing_install_app')}
            </button>
          </div>

          <p className="text-xs text-vicoba-dark/50 font-medium mt-5">{t('install_hint')}</p>
        </div>

        <div className="lg:col-span-5">
          <div className="relative max-w-md mx-auto">
            <div className="absolute z-0 -bottom-4 -right-4 w-full h-full bg-vicoba-forest hidden sm:block"></div>
            <div className="relative z-10 border-[6px] border-white shadow-[0_0_0_2px_#2E302E] rotate-[-1.2deg] bg-white">
              <img
                src={heroBg}
                alt={t('landing_photo_caption')}
                className="block w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>
          <p className="text-center text-xs text-vicoba-dark/50 font-medium italic mt-5">
            {t('landing_photo_caption')}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-10 h-px bg-vicoba-gold"></span>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-vicoba-gold">{t('landing_why_eyebrow')}</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-vicoba-dark mb-10">
          {t('landing_why_heading')}
        </h2>

        <LedgerRow
          number="01"
          icon={<FaPiggyBank />}
          title={t('feature_shares_title')}
          desc={t('feature_shares_desc')}
        />
        <LedgerRow
          number="02"
          icon={<FaMoneyBillWave />}
          title={t('feature_loans_title')}
          desc={t('feature_loans_desc')}
        />
        <LedgerRow
          number="03"
          icon={<FaUsers />}
          title={t('feature_transparency_title')}
          desc={t('feature_transparency_desc')}
          last
        />
      </section>

      <section className="bg-vicoba-dark text-vicoba-cream">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-16 grid sm:grid-cols-2 gap-px bg-vicoba-cream/10">
          <div className="bg-vicoba-dark p-8 sm:p-10">
            <h3 className="font-serif text-xl mb-3">{t('contact_help_title')}</h3>
            <p className="text-sm text-vicoba-cream/65 font-medium leading-relaxed mb-6">
              {t('contact_help_desc')}
            </p>
            <a
              href={DEV_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-vicoba-gold font-bold text-sm border-b-2 border-vicoba-gold pb-1 hover:gap-3 transition-all"
            >
              <FaWhatsapp size={16} /> {t('contact_whatsapp_us')} <FaArrowRight size={12} />
            </a>
          </div>

          <div className="bg-vicoba-dark p-8 sm:p-10">
            <h3 className="font-serif text-xl mb-3">{t('contact_dev_title')}</h3>
            <p className="text-sm text-vicoba-cream/65 font-medium leading-relaxed mb-6">Methynix Software</p>
            <a
              href={`tel:${DEV_PHONE.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 text-vicoba-gold font-bold text-sm border-b-2 border-vicoba-gold pb-1 hover:gap-3 transition-all"
            >
              {DEV_PHONE} <FaArrowRight size={12} />
            </a>
          </div>
        </div>
      </section>

      <p className="text-center text-vicoba-dark/40 text-xs font-semibold py-8 border-t border-vicoba-dark/10">
        © {new Date().getFullYear()} Methynix Software. {t('rights_reserved')}
      </p>
    </div>
  );
};

const LedgerRow = ({ number, icon, title, desc, last }) => (
  <div className={`grid grid-cols-12 gap-4 sm:gap-6 py-8 border-t border-vicoba-dark/15 ${last ? 'border-b' : ''}`}>
    <div className="col-span-3 sm:col-span-2">
      <span className="font-serif text-3xl sm:text-4xl text-vicoba-gold/70">{number}</span>
    </div>
    <div className="hidden sm:flex sm:col-span-1 items-start pt-1.5 text-vicoba-forest text-xl">
      {icon}
    </div>
    <div className="col-span-9">
      <h3 className="font-serif text-lg sm:text-xl text-vicoba-dark mb-1.5">{title}</h3>
      <p className="text-sm text-vicoba-dark/65 font-medium leading-relaxed max-w-md">{desc}</p>
    </div>
  </div>
);

export default LandingPage;
