import React from 'react';

export default function ToggleSwitch({
  checked = false,
  onChange,
  label = "",
  size = "md",
  disabled = false,
}) {
  const isSm = size === 'sm';

  return (
    <label className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={`relative inline-flex shrink-0 transition-colors duration-200 ease-in-out rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          isSm ? 'h-5 w-9' : 'h-6 w-11'
        } ${checked ? 'bg-emerald-500' : 'bg-slate-200'}`}
      >
        <span
          className={`inline-block rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
            isSm
              ? checked ? 'translate-x-4 h-4 w-4' : 'translate-x-0 h-4 w-4'
              : checked ? 'translate-x-5 h-5 w-5' : 'translate-x-0 h-5 w-5'
          }`}
        />
      </button>
      {label && <span className="text-xs font-medium text-slate-600">{label}</span>}
    </label>
  );
}

