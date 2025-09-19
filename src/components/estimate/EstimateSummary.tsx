'use client';

import React, { useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface EstimateSummaryProps {
  total: number;
  notes: string;
  setNotes: (notes: string) => void;
}

export function EstimateSummary({
  total,
  notes,
  setNotes,
}: EstimateSummaryProps) {
  // Memoized formatted total
  const formattedTotal = useMemo(() => total.toFixed(2), [total]);

  // Memoized notes change handler
  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNotes(e.target.value);
    },
    [setNotes]
  );

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-slate-800'>Estimate Summary</h2>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Total Estimated Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='bg-slate-100 rounded-xl p-6 text-center'>
            <p className='text-sm font-semibold text-slate-600'>TOTAL</p>
            <p className='text-4xl font-bold text-slate-800 mt-1'>
              ${formattedTotal}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>General Project Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id='project-notes'
            label='Project Notes'
            value={notes}
            onChange={handleNotesChange}
            placeholder='Add general project notes here...'
            rows={6}
          />
        </CardContent>
      </Card>
    </div>
  );
}
