import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaPiggyBank, FaHandHoldingUsd } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-screen flex flex-col justify-center items-center text-center p-4">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover"></div>
        
        <h1 className="text-6xl font-bold mb-4 z-10 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          METHYNIX-VICOBA
        </h1>
        <p className="text-xl mb-8 z-10 text-gray-300 max-w-2xl">
          Digitalizing Village Community Banks. Secure your future, grow your savings, and access loans with transparency.
        </p>
        
        <div className="flex gap-4 z-10">
          <button onClick={() => navigate('/login')} className="btn-glow px-8 py-3 rounded-full font-bold">
            Get Started
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 p-12">
        <FeatureCard icon={<FaPiggyBank />} title="Shares Tracking" desc="Monitor your weekly shares and social fund contributions in real-time." />
        <FeatureCard icon={<FaHandHoldingUsd />} title="Easy Loans" desc="Borrow based on your shares with automated interest calculations." />
        <FeatureCard icon={<FaUsers />} title="Group Transparency" desc="Every transaction is logged. No more hidden ledger books." />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="card-glass p-8 flex flex-col items-center text-center hover:border-blue-500 transition-all">
    <div className="text-4xl text-blue-400 mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{desc}</p>
  </div>
);

export default LandingPage;