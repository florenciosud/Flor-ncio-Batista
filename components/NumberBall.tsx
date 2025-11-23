import React from 'react';

interface NumberBallProps {
  number: number;
  status: 'available' | 'chosen' | 'current';
  onClick?: () => void;
}

export const NumberBall: React.FC<NumberBallProps> = ({ number, status, onClick }) => {
  let baseClasses = "flex items-center justify-center rounded-full font-bold shadow-md transition-all duration-300 cursor-default select-none";
  let sizeClasses = "w-12 h-12 text-lg";
  let colorClasses = "";

  if (status === 'available') {
    colorClasses = "bg-slate-700 text-slate-300 border-2 border-slate-600 hover:bg-slate-600";
  } else if (status === 'chosen') {
    colorClasses = "bg-indigo-900/50 text-indigo-400 border-2 border-indigo-900/50 opacity-60";
    sizeClasses = "w-10 h-10 text-sm"; // Smaller for history
  } else if (status === 'current') {
    colorClasses = "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/50 border-4 border-emerald-300 scale-110 animate-pulse";
    sizeClasses = "w-32 h-32 text-6xl"; // Huge for current
  }

  return (
    <div className={`${baseClasses} ${sizeClasses} ${colorClasses}`} onClick={onClick}>
      {number}
    </div>
  );
};