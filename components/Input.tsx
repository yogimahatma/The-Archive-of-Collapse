import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-xs uppercase tracking-widest text-red-900/70 font-bold font-sans">{label}</label>
      <input
        className={`bg-black border border-zinc-800 text-zinc-300 px-4 py-3 font-serif focus:outline-none focus:border-red-900/50 transition-colors placeholder-zinc-700 read-only:bg-zinc-900/30 read-only:text-zinc-500 read-only:border-zinc-800/50 read-only:cursor-not-allowed ${className}`}
        {...props}
      />
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-xs uppercase tracking-widest text-red-900/70 font-bold font-sans">{label}</label>
      <textarea
        className={`bg-black border border-zinc-800 text-zinc-300 px-4 py-3 font-serif focus:outline-none focus:border-red-900/50 transition-colors placeholder-zinc-700 min-h-[120px] resize-y read-only:bg-zinc-900/30 read-only:text-zinc-500 read-only:border-zinc-800/50 read-only:cursor-not-allowed ${className}`}
        {...props}
      />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-xs uppercase tracking-widest text-red-900/70 font-bold font-sans">{label}</label>
      <div className="relative">
        <select
          className={`w-full appearance-none bg-black border border-zinc-800 text-zinc-300 px-4 py-3 font-serif focus:outline-none focus:border-red-900/50 transition-colors cursor-pointer ${className}`}
          {...props}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};