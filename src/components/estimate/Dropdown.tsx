interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  selectedOption: string;
  onSelect: (value: string) => void;
}

export function Dropdown({
  label,
  options,
  selectedOption,
  onSelect,
}: DropdownProps) {
  return (
    <div>
      <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
        {label}
      </label>
      <div className='relative'>
        <select
          value={selectedOption}
          onChange={(e) => onSelect(e.target.value)}
          className='block appearance-none w-full bg-slate-50 border border-blue-300 text-slate-700 py-2.5 px-4 pr-8 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
          aria-label={label}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-500'>
          <svg
            className='fill-current h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
          >
            <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
          </svg>
        </div>
      </div>
    </div>
  );
}
