import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaPiggyBank, FaMoneyBillWave } from 'react-icons/fa6';
import heroBg from '/hero-vicoba.jpg';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-vicoba-dark selection:bg-vicoba-forest/10">
      <div className="relative min-h-[85vh] flex flex-col justify-center items-center text-center p-6 overflow-hidden">
        
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="VICOBA Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-white/30 bg-gradient-to-b from-transparent via-white/20 to-gray-50"></div>
        </div>
        
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-vicoba-forest/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-vicoba-gold/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full text-xs font-bold text-vicoba-forest uppercase tracking-wider shadow-sm">
            Mfumo wa Kidijitali wa Vikoba
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-vicoba-dark tracking-tight leading-none drop-shadow-sm">
            METHYNIX <span className="text-vicoba-forest">UMOJA VIKOBA</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-vicoba-dark/80 max-w-2xl mx-auto font-semibold leading-relaxed">
            Rahisisha uendeshaji wa kikundi chenu. Weka akiba, fuatilia hisa, na uombe mikopo kwa uwazi, usalama na urahisi mkubwa kupitia simu au kompyuta.
          </p>
          
          <div className="pt-4">
            <button 
              onClick={() => navigate('/login')} 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-vicoba-forest text-white hover:bg-emerald-950 font-bold text-base shadow-lg shadow-vicoba-forest/20 transition-all transform hover:-translate-y-0.5"
            >
              Anza Sasa hivi
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <FeatureCard 
            icon={<FaPiggyBank />} 
            title="Ufuatiliaji wa Hisa" 
            desc="Fuatilia michango yako ya kila wiki, hisa ulizonunua, na mfuko wa jamii kwa uwazi na kwa wakati halisi (real-time)." 
          />
          <FeatureCard 
            icon={<FaMoneyBillWave />} 
            title="Mikopo ya Haraka" 
            desc="Omba mkopo kwa urahisi kulingana na vigezo vya kikundi chenu, huku mfumo ukikokotoa riba kiotomatiki bila makosa." 
          />
          <FeatureCard 
            icon={<FaUsers />} 
            title="Uwazi Ndani ya Kikundi" 
            desc="Kila muamala unaofanyika unarekodiwa na kuonekana kwa wanachama wote. Hakuna tena haja ya daftari za siri zilizofichwa." 
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-md shadow-vicoba-forest/5 flex flex-col items-center text-center transition-all hover:border-gray-200 group">
    <div className="w-14 h-14 rounded-xl bg-emerald-50 text-vicoba-forest flex items-center justify-center text-2xl mb-5 group-hover:bg-vicoba-forest group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-extrabold text-vicoba-dark mb-2.5">{title}</h3>
    <p className="text-sm font-medium text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;