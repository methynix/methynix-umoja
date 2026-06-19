import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa6';

/**
 * Password field with a built-in show/hide toggle.
 * Works with react-hook-form. Pass custom `rules` for things like
 * "passwords must match".
 */
const PasswordInput = ({
  register,
  name,
  errors = {},
  placeholder,
  label,
  rules = {},
}) => {
  const [show, setShow] = useState(false);
  const fieldError = errors?.[name];

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-bold text-vicoba-dark uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-vicoba-forest" />
        <input
          type={show ? 'text' : 'password'}
          {...register(name, { required: 'Sehemu hii ni lazima', ...rules })}
          className={`w-full bg-gray-50 border ${
            fieldError ? 'border-vicoba-earth' : 'border-gray-300'
          } p-3.5 pl-12 pr-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf outline-none text-vicoba-dark text-sm font-medium transition-all`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Ficha nywila' : 'Onyesha nywila'}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-vicoba-forest transition-colors"
        >
          {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
      {fieldError && (
        <span className="text-[10px] text-vicoba-earth font-bold uppercase">
          {fieldError.message}
        </span>
      )}
    </div>
  );
};

export default PasswordInput;
