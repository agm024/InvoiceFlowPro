'use client';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MarketingNavClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-sm'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <span className="text-white font-black text-base leading-none">I</span>
          </div>
          <span className="font-black text-lg tracking-tight text-zinc-900 dark:text-white">
            InvoiceFlow<span className="text-blue-600 dark:text-blue-500">Pro</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-lg transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/app"
              className="text-sm font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-bold bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Start Free →
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] px-4 py-4 flex flex-col gap-1 shadow-xl">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-zinc-700 dark:text-zinc-300 py-3 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
          {isLoggedIn ? (
            <Link href="/app" className="text-center font-bold bg-blue-600 text-white px-5 py-3.5 rounded-xl hover:bg-blue-700 transition mt-1">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                onClick={() => setIsOpen(false)}
                className="text-center font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 px-5 py-3.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setIsOpen(false)}
                className="text-center font-bold bg-blue-600 text-white px-5 py-3.5 rounded-xl hover:bg-blue-700 transition mt-1"
              >
                Start Free →
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
