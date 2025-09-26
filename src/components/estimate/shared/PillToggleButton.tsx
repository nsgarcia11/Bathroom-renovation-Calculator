interface PillToggleButtonProps {
  label: string;
  isSelected: boolean;
  onToggle: (value: boolean) => void;
}

export function PillToggleButton({
  label,
  isSelected,
  onToggle,
}: PillToggleButtonProps) {
  return (
    <div className='flex items-center justify-between p-4 bg-white rounded-lg border border-blue-300'>
      <span className='text-sm font-semibold text-slate-700'>{label}</span>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => onToggle(false)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            !isSelected
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          No
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            isSelected
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Yes
        </button>
      </div>
    </div>
  );
}
