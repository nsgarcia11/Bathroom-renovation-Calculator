'use client';

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function ToggleSwitch({
  label,
  enabled,
  onToggle,
  className = '',
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <div className={`flex items-center justify-between ${className} ${disabled ? 'opacity-50' : ''}`}>
      <span className='text-sm font-medium text-slate-800'>{label}</span>
      <button
        onClick={() => !disabled && onToggle(!enabled)}
        disabled={disabled}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out border ${
          enabled
            ? 'bg-blue-600 border-transparent'
            : 'bg-slate-200 border-blue-300'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
