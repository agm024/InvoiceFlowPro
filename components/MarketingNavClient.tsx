'use client';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function MarketingNavClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl leading-none">I</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
            InvoiceFlow<span className="text-blue-600 dark:text-blue-500">Pro</span>
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition">How It Works</Link>
          <Link href="#pricing" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition">Pricing</Link>
          <Link href="#faq" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition">FAQ</Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link href="/app" className="text-sm font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition shadow-sm">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">Log in</Link>
              <Link href="/sign-up" className="text-sm font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition shadow-sm">Start Free</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-zinc-600 dark:text-zinc-400" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] p-6 flex flex-col gap-4 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-xl">
          <Link href="#features" onClick={() => setIsOpen(false)} className="text-base font-medium">Features</Link>
          <Link href="#how-it-works" onClick={() => setIsOpen(false)} className="text-base font-medium">How It Works</Link>
          <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-base font-medium">Pricing</Link>
          <Link href="#faq" onClick={() => setIsOpen(false)} className="text-base font-medium">FAQ</Link>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2"></div>
          {isLoggedIn ? (
            <Link href="/app" className="text-center font-semibold bg-blue-600 text-white px-5 py-3 rounded-xl">Dashboard</Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-center font-semibold border border-zinc-200 dark:border-zinc-800 px-5 py-3 rounded-xl">Log in</Link>
              <Link href="/sign-up" className="text-center font-semibold bg-blue-600 text-white px-5 py-3 rounded-xl">Start Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
