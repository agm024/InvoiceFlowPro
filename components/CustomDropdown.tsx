'use client'

import { useState, useRef, useEffect } from 'react'

export default function CustomDropdown({ value, onChange, options, className = "", align = "left", renderButton, buttonClassName }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o: any) => o.value === value) || options[0];

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className={renderButton ? undefined : buttonClassName || `flex items-center justify-between w-full bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm ${isOpen ? 'ring-2 ring-primary/20' : ''}`}
      >
        {renderButton ? renderButton(selectedOption, isOpen) : (
          <>
            <span className="truncate mr-2">{selectedOption?.label}</span>
            <svg className={`fill-current h-4 w-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </>
        )}
      </button>

      {isOpen && (
        <div className={`absolute z-50 mt-1 ${align === 'right' ? 'right-0' : 'left-0'} w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden py-1`}>
          {options.map((opt: any) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors whitespace-normal break-words ${value === opt.value ? 'bg-zinc-100 dark:bg-zinc-800 font-bold text-primary' : 'font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
