import { Select } from '@/components/ui/select';

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
      <Select
        id='dropdown'
        label={label}
        value={selectedOption}
        onChange={(e) => onSelect(e.target.value)}
        className='block appearance-none w-full bg-slate-50 border border-blue-300 text-slate-700 py-2.5 px-4 pr-8 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
