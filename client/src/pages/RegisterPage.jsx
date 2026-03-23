import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaPhone, FaLock, FaUsers, FaArrowRight, FaCamera } from 'react-icons/fa6';
import axiosInstance from '../services/axiosInstance';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onRegister = async (data) => {
    setLoading(true);
    try {
      // Data itatumwa ikiwa na: name, phone, password, groupCode, na groupName
      await axiosInstance.post('/auth/register', data);
      
      toast.success('Akaunti na Kikundi vimesajiliwa! Karibu METHYNIX-UMOJA.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Usajili umefeli. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Aura */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="card-glass p-6 md:p-10 w-full max-w-2xl relative z-10 border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-black italic bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent uppercase tracking-tighter">
            METHYNIX-VICOBA
          </h1>
          <p className="text-gray-500 mt-2 text-xs md:text-sm font-bold uppercase tracking-widest">Usajili wa Mwanachama & Kikundi</p>
        </div>

        <form onSubmit={handleSubmit(onRegister)} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* --- SEHEMU YA MWANACHAMA --- */}
            <div className="space-y-4">
              <h3 className="text-neon-green text-[10px] font-black uppercase tracking-[0.3em] mb-2">Taarifa Binafsi</h3>
              
              <div className="relative">
                <FaUser className="absolute left-4 top-4 text-gray-500" />
                <input
                  {...register("name", { required: "Jina lako linahitajika" })}
                  className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-xl focus:border-neon-green outline-none text-white text-sm"
                  placeholder="Jina lako kamili"
                />
              </div>

              <div className="relative">
                <FaPhone className="absolute left-4 top-4 text-gray-500" />
                <input
                  {...register("phone", { required: "Namba ya simu inahitajika" })}
                  className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-xl focus:border-neon-green outline-none text-white text-sm"
                  placeholder="Namba ya simu"
                />
              </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  
  {/* Password ya Kwanza */}
  <div className="relative">
    <FaLock className="absolute left-4 top-4 text-gray-500" />
    <input
      type="password"
      {...register("password", { 
        required: "Password inahitajika",
        minLength: { value: 6, message: "Tumia herufi kuanzia 6" }
      })}
      className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} p-3.5 pl-12 rounded-xl focus:border-neon-green outline-none text-white text-sm transition-all`}
      placeholder="Nywila (Password)"
    />
    {errors.password && <span className="text-[9px] text-red-500 font-bold mt-1 ml-2 uppercase">{errors.password.message}</span>}
  </div>

  {/* Confirm Password Field */}
  <div className="relative">
    <FaLock className={`absolute left-4 top-4 ${errors.confirmPassword ? 'text-red-500' : 'text-gray-500'}`} />
    <input
      type="password"
      {...register("confirmPassword", { 
        required: "Tafadhali rudia password",
        validate: (value) => value === password || "Password hazifanani!" 
      })}
      className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10'} p-3.5 pl-12 rounded-xl focus:border-neon-green outline-none text-white text-sm transition-all`}
      placeholder="Rudia Nywila"
    />
    {errors.confirmPassword && (
      <span className="text-[9px] text-red-500 font-bold mt-1 ml-2 uppercase animate-pulse">
        {errors.confirmPassword.message}
      </span>
    )}
  </div>

</div>
            </div>

            {/* --- SEHEMU YA KIKUNDI --- */}
            <div className="space-y-4">
              <h3 className="text-neon-blue text-[10px] font-black uppercase tracking-[0.3em] mb-2">Taarifa za Kikundi</h3>
              
              <div className="relative">
                <FaUsers className="absolute left-4 top-4 text-gray-500" />
                <input
                  {...register("groupName", { required: "Jina la kikundi linahitajika" })}
                  className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-xl focus:border-neon-blue outline-none text-white text-sm"
                  placeholder="Jina la Kikundi (e.g. UMOJA VICOBA)"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-4 text-gray-500" />
                <input
                  {...register("groupCode", { required: "Code ya kikundi inahitajika" })}
                  className="w-full bg-white/5 border border-white/10 p-3.5 pl-12 rounded-xl focus:border-neon-blue outline-none text-white text-sm"
                  placeholder="Group Code (e.g. 123456)"
                />
              </div>

              <p className="text-[9px] text-gray-600 italic leading-tight">
                * Kama wewe ni wa kwanza kutumia Code hii, utakuwa Admin wa kikundi hiki automatically.
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-glow py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {loading ? 'Inasajili...' : <>Kamilisha Usajili <FaArrowRight /></>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-500 text-xs font-bold">
            Tayari una akaunti?{' '}
            <Link to="/login" className="text-neon-blue hover:underline">Ingia Hapa</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;