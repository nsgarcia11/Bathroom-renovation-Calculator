import { Input } from '@/components/ui/input';

interface QuantityInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function QuantityInput({ label, value, onChange }: QuantityInputProps) {
  return (
    <div className='flex items-center justify-between'>
      <label className='text-sm text-slate-600'>{label}</label>
      <Input
        type='number'
        value={value.toString()}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 1)}
        className='w-16 p-1.5 text-center border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        aria-label={label}
      />
    </div>
  );
}
