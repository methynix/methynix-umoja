import React from 'react';
import { FaGear } from 'react-icons/fa6';

const MaintenancePage = () => {
  return (
    <div className="h-screen w-full bg-vicoba-cream flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <div className="relative z-10 text-center space-y-6">
     <div className="inline-block p-6 rounded-3xl bg-white border border-gray-100 shadow-md shadow-vicoba-forest/5 animate-spin">
   <FaGear size={60} className="text-vicoba-forest" />
</div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-vicoba-dark tracking-tight">
  Matengenezo ya <span className="text-vicoba-forest">Mfumo</span>
</h1>
<p className="text-gray-500 font-semibold text-sm md:text-base tracking-normal max-w-md mx-auto">
  Tunaboresha mfumo wako wa Vicoba kwa ajili ya usalama na huduma bora zaidi. Tafadhali jaribu tena baada ya muda mfupi.
</p>
        <div className="pt-6">
   <div className="h-1.5 w-48 bg-gray-200 mx-auto rounded-full overflow-hidden">
      <div className="h-full bg-vicoba-forest w-1/2 rounded-full animate-pulse"></div>
   </div>
</div>
        <a href="/login" className="inline-block mt-4 text-xs font-bold text-vicoba-forest hover:text-vicoba-leaf underline transition-colors">
          Rudi kuingia (Login)
        </a>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pt-2">Methynix Software</p>
      </div>
    </div>
  );
};

export default MaintenancePage;