import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaPhone, FaLock, FaUsers, FaArrowRight, FaCamera } from 'react-icons/fa6';
import axiosInstance from '../services/axiosInstance';
import PasswordInput from '../components/PasswordInput';
import Spinner from '../components/Spinner';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onRegister = async (data) => {
    setLoading(true);
    try {
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
    <div className="min-h-screen bg-vicoba-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Aura */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="bg-white p-6 md:p-10 w-full max-w-2xl rounded-2xl border border-gray-100 shadow-xl shadow-vicoba-forest/5">
  <div className="text-center mb-8">
    <h1 className="text-3xl md:text-4xl font-extrabold text-vicoba-forest tracking-tight">
      METHYNIX VICOBA
    </h1>
    <p className="text-vicoba-dark mt-2 text-sm font-semibold">Usajili wa Mwanachama & Kikundi</p>
  </div>

        <form onSubmit={handleSubmit(onRegister)} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
  <h3 className="text-vicoba-forest text-xs font-bold uppercase tracking-wider border-b border-gray-100 pb-1 mb-2">Taarifa Binafsi</h3>
  
  <div>
    <label className="block text-xs font-bold text-vicoba-dark mb-1">Jina Kamili</label>
    <div className="relative">
      <FaUser className="absolute left-4 top-3.5 text-vicoba-forest" />
      <input
        {...register("name", { required: "Jina lako linahitajika" })}
        className="w-full bg-gray-50 border border-gray-300 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark text-sm font-medium transition-all"
        placeholder="Mussa au Asha..."
      />
    </div>
    {errors.name && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.name.message}</span>}
  </div>

  <div>
    <label className="block text-xs font-bold text-vicoba-dark mb-1">Namba ya Simu</label>
    <div className="relative">
      <FaPhone className="absolute left-4 top-3.5 text-vicoba-forest" />
      <input
        {...register("phone", { required: "Namba ya simu inahitajika" })}
        className="w-full bg-gray-50 border border-gray-300 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark text-sm font-medium transition-all"
        placeholder="07xxxxxxxx"
      />
    </div>
    {errors.phone && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.phone.message}</span>}
  </div>
             <div className="grid grid-cols-1 gap-4">

  <PasswordInput
    register={register}
    name="password"
    errors={errors}
    label="Nywila (Password)"
    placeholder="Tengeneza password"
    rules={{ required: "Password inahitajika", minLength: { value: 6, message: "Tumia herufi kuanzia 6" } }}
  />

  <PasswordInput
    register={register}
    name="confirmPassword"
    errors={errors}
    label="Thibitisha Nywila"
    placeholder="Rudia tena password"
    rules={{ required: "Tafadhali rudia password", validate: (value) => value === password || "Password hazifanani!" }}
  />

</div>
            </div>

           <div className="space-y-4">
  <h3 className="text-vicoba-forest text-xs font-bold uppercase tracking-wider border-b border-gray-100 pb-1 mb-2">Taarifa za Kikundi</h3>
  
  <div>
    <label className="block text-xs font-bold text-vicoba-dark mb-1">Jina la Kikundi</label>
    <div className="relative">
      <FaUsers className="absolute left-4 top-3.5 text-vicoba-forest" />
      <input
        {...register("groupName", { required: "Jina la kikundi linahitajika" })}
        className="w-full bg-gray-50 border border-gray-300 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark text-sm font-medium transition-all"
        placeholder="Mfano: WANAAWAKE WA SHUTI"
      />
    </div>
    {errors.groupName && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.groupName.message}</span>}
  </div>

  <div>
    <label className="block text-xs font-bold text-vicoba-dark mb-1">Namba ya Kikundi (Code)</label>
    <div className="relative">
      <FaLock className="absolute left-4 top-3.5 text-vicoba-forest" />
      <input
        {...register("groupCode", { required: "Code ya kikundi inahitajika" })}
        className="w-full bg-gray-50 border border-gray-300 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark text-sm font-medium transition-all"
        placeholder="Tengeneza tarakimu fupi (e.g. 4589)"
      />
    </div>
    {errors.groupCode && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.groupCode.message}</span>}
  </div>

  <p className="text-xs text-gray-500 font-medium bg-vicoba-cream p-2.5 rounded-lg border border-gray-100 leading-snug">
    💡 Kama wewe ni wa kwanza kusajili Code hii, utakuwa Admin (Kiongozi) wa kikundi hiki moja kwa moja.
  </p>
</div>
          </div>

        <button 
    type="submit" 
    disabled={loading}
    className="w-full bg-vicoba-forest hover:bg-emerald-900 text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60 transition-colors shadow-md shadow-vicoba-forest/20 mt-6 active:scale-[0.99]"
  >
    {loading ? <><Spinner /> Inasajili Taarifa...</> : <>Kamilisha Usajili <FaArrowRight /></>}
  </button>
</form>

<div className="mt-6 pt-5 border-t border-gray-100 text-center">
  <p className="text-vicoba-dark text-sm font-medium">
    Tayari una akaunti ya kikundi?{' '}
    <Link to="/login" className="text-vicoba-forest hover:text-vicoba-leaf font-bold underline transition-colors">
      Ingia Hapa
    </Link>
  </p>
</div>
<p className="text-center text-gray-400 text-xs font-semibold mt-6">
  © {new Date().getFullYear()} Methynix Software
</p>
      </div>
    </div>
  );
};

export default RegisterPage;