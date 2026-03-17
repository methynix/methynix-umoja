import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaPhone, FaLock, FaUsers, FaArrowRight } from 'react-icons/fa';
import axiosInstance from '../services/axiosInstance';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onRegister = async (data) => {
    setLoading(true);
    try {
      // In a real VICOBA, you might register a user AND link them to a group
      // For now, we hit the general register endpoint
      await axiosInstance.post('/auth/register', data);
      
      toast.success('Akaunti imetengenezwa! Karibu Umoja.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Usajili umefeli. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="card-glass p-8 w-full max-w-lg relative z-10 border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            JIUNGE NA UMOJA
          </h1>
          <p className="text-gray-400 mt-2">Anza safari yako ya kifedha kidijitali</p>
        </div>

        <form onSubmit={handleSubmit(onRegister)} className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
              <FaUser size={18} />
            </div>
            <input
              {...register("name", { required: "Jina kamili linahitajika" })}
              className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} p-4 pl-12 rounded-xl focus:border-green-500 outline-none text-white transition-all`}
              placeholder="Jina Kamili (Full Name)"
            />
            {errors.name && <span className="text-red-500 text-xs mt-1 ml-2">{errors.name.message}</span>}
          </div>

          {/* Phone Number */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
              <FaPhone size={18} />
            </div>
            <input
              {...register("phone", { 
                required: "Namba ya simu inahitajika",
                pattern: { value: /^[0-9]{10}$/, message: "Tumia namba halisi (e.g 0712345678)" }
              })}
              className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} p-4 pl-12 rounded-xl focus:border-blue-500 outline-none text-white transition-all`}
              placeholder="Namba ya Simu"
            />
            {errors.phone && <span className="text-red-500 text-xs mt-1 ml-2">{errors.phone.message}</span>}
          </div>

          {/* Group Code (Optional or Required based on your VICOBA logic) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
              <FaUsers size={18} />
            </div>
            <input
              {...register("groupCode")}
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:border-blue-500 outline-none text-white transition-all"
              placeholder="Namba ya Kikundi (Optional)"
            />
          </div>

          {/* Password Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FaLock size={18} />
              </div>
              <input
                type="password"
                {...register("password", { 
                  required: "Password inahitajika",
                  minLength: { value: 6, message: "Tumia herufi kuanzia 6" }
                })}
                className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} p-4 pl-12 rounded-xl focus:border-green-500 outline-none text-white transition-all`}
                placeholder="Password"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FaLock size={18} />
              </div>
              <input
                type="password"
                {...register("confirmPassword", { 
                  validate: value => value === password || "Password hazifanani"
                })}
                className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} p-4 pl-12 rounded-xl focus:border-green-500 outline-none text-white transition-all`}
                placeholder="Rudia Password"
              />
            </div>
          </div>
          {errors.password && <span className="text-red-500 text-xs mt-1 ml-2">{errors.password.message}</span>}
          {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 ml-2">{errors.confirmPassword.message}</span>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-glow py-4 rounded-xl font-bold text-lg uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Inasajili...' : (
              <>
                Tengeneza Akaunti <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-500">
            Tayari una akaunti?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium underline-offset-4 hover:underline">
              Ingia Hapa
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;