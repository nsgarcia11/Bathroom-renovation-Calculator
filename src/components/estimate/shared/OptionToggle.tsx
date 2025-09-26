interface OptionToggleProps {
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
}

export function OptionToggle({
  label,
  isEnabled,
  onToggle,
}: OptionToggleProps) {
  return (
    <label className='flex items-center justify-between cursor-pointer p-4 bg-white rounded-lg border border-blue-300'>
      <span className='text-sm font-semibold text-slate-700'>{label}</span>
      <div className='relative inline-flex items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isEnabled}
            onChange={onToggle}
            className='sr-only peer'
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 border border-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-700 peer-checked:border-blue-700"></div>
        </div>
      </div>
    </label>
  );
}
