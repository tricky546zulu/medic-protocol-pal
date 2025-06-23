
import React from 'react';

export const MedicationDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-blue-50/40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(221,214,254,0.1),transparent_50%)]"></div>
      
      <div className="relative container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-white/70 rounded-lg w-1/3"></div>
          <div className="h-4 bg-white/50 rounded-lg w-1/2"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-lg p-8">
                <div className="h-6 bg-white/70 rounded-lg mb-5"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/50 rounded-lg"></div>
                  <div className="h-4 bg-white/50 rounded-lg w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
