import { School } from 'lucide-react';
import Link from 'next/link';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const textSizeClass = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl';
  const iconSize = size === 'lg' ? 32 : size === 'md' ? 28 : 24;

  return (
    <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <School size={iconSize} className="text-accent" />
      <span className={`font-headline font-semibold ${textSizeClass}`}>
        Bursary <span className="text-accent">Buddy</span>
      </span>
    </Link>
  );
}
