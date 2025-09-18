'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface EstimateSummaryProps {
  total: number;
  notes: string;
  setNotes: (notes: string) => void;
}

export function EstimateSummary({ total, notes, setNotes }: EstimateSummaryProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Estimate Summary</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Estimated Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-100 rounded-xl p-6 text-center">
            <p className="text-sm font-semibold text-slate-600">TOTAL</p>
            <p className="text-4xl font-bold text-slate-800 mt-1">${total.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">General Project Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            id="project-notes"
            label="Project Notes"
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Add general project notes here..." 
            rows={6}
          />
        </CardContent>
      </Card>
    </div>
  );
}
