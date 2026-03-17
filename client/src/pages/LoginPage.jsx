import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {useAuth} from "../hooks/useAuth";

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const {login}=useAuth();

  const onLogin = async (data) => {
  const success = await login(data.phone, data.password);
  if (success) {
    toast.success('Successfully logged in!');
    navigate('/dashboard', { replace: true });
  }
};

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="card-glass p-10 w-full max-w-md relative z-10 border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            METHYNIX VICOBA
          </h1>
          <p className="text-gray-400 mt-2">Welcome back to Methynix-Vicoba portal</p>
        </div>

        <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
          <div>
            <input 
              {...register("phone", { required: "Phone is required" })}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-green-500 outline-none text-white transition-all shadow-inner"
              placeholder="Phone Number"
            />
          </div>
          <div>
            <input 
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-green-500 outline-none text-white transition-all shadow-inner"
              placeholder="PIN / Password"
            />
          </div>
          
          <button type="submit" className="w-full btn-glow py-4 rounded-xl font-bold text-lg uppercase tracking-widest">
            Enter Dashboard
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register Group</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;