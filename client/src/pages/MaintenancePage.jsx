import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGear } from 'react-icons/fa6';

const MaintenancePage = () => {
  const { t } = useTranslation();
  return (
    <div className="h-screen w-full bg-vicoba-cream dark:bg-gray-950 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <div className="relative z-10 text-center space-y-6">
     <div className="inline-block p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5 animate-spin">
   <FaGear size={60} className="text-vicoba-forest" />
</div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">
  {t('maintenance_title')} <span className="text-vicoba-forest">{t('maintenance_word')}</span>
</h1>
<p className="text-gray-500 dark:text-gray-300 font-semibold text-sm md:text-base tracking-normal max-w-md mx-auto">
  {t('maintenance_desc')}
</p>
        <div className="pt-6">
   <div className="h-1.5 w-48 bg-gray-200 mx-auto rounded-full overflow-hidden">
      <div className="h-full bg-vicoba-forest w-1/2 rounded-full animate-pulse"></div>
   </div>
</div>
        <a href="/login" className="inline-block mt-4 text-xs font-bold text-vicoba-forest hover:text-vicoba-leaf underline transition-colors">
          {t('back_to_login')}
        </a>
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider pt-2">Methynix Software</p>
      </div>
    </div>
  );
};

export default MaintenancePage;