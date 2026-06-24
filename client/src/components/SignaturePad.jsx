import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SignaturePad = ({ value, onChange, label }) => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasInk, setHasInk] = useState(Boolean(value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1f2937';
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = value;
      setHasInk(true);
    }
  }, []);

  const pos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return {
      x: (point.clientX - rect.left) * (canvas.width / rect.width),
      y: (point.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    setHasInk(true);
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (onChange) onChange(canvasRef.current.toDataURL('image/png'));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    if (onChange) onChange('');
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100">{label}</label>
      )}
      <div className="relative rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={520}
          height={160}
          className="w-full h-40 touch-none cursor-crosshair"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
        {!hasInk && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-300 dark:text-gray-600 pointer-events-none">
            {t('sign_here')}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        className="text-[11px] font-bold text-vicoba-earth hover:underline"
      >
        {t('clear_signature')}
      </button>
    </div>
  );
};

export default SignaturePad;
