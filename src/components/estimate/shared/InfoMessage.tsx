interface InfoMessageProps {
  message: string;
  onClose: () => void;
}

export function InfoMessage({ message, onClose }: InfoMessageProps) {
  return (
    <div className='text-red-600 flex justify-between items-center my-2 animate-fade-in'>
      <div className='flex items-center'>
        <svg
          className='w-6 h-6 mr-2'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        <p className='text-xs'>{message}</p>
      </div>
      <button
        onClick={onClose}
        className='p-1 rounded-full hover:bg-slate-200 transition-colors'
        aria-label='Close message'
      >
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
    </div>
  );
}
