interface PerformedByToggleProps {
  performedBy: 'me' | 'trade';
  onToggle: (value: 'me' | 'trade') => void;
}

export function PerformedByToggle({
  performedBy,
  onToggle,
}: PerformedByToggleProps) {
  const baseClasses =
    'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors';
  const activeClasses = 'bg-blue-600 text-white';
  const inactiveClasses = 'bg-slate-200 text-slate-700 hover:bg-slate-300';

  return (
    <div className='flex items-center justify-center space-x-2'>
      <button
        onClick={() => onToggle('me')}
        className={`${baseClasses} ${
          performedBy === 'me' ? activeClasses : inactiveClasses
        }`}
      >
        Me
      </button>
      <button
        onClick={() => onToggle('trade')}
        className={`${baseClasses} ${
          performedBy === 'trade' ? activeClasses : inactiveClasses
        }`}
      >
        Trade
      </button>
    </div>
  );
}
