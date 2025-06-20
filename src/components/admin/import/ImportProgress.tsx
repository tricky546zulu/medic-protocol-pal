
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ImportProgressProps {
  progress: number;
}

export const ImportProgress = ({ progress }: ImportProgressProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Progress value={progress} className="flex-1" />
      <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
    </div>
  );
};
