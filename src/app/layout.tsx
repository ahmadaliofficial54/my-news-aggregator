import { ReactNode } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'My News Aggregator',
  description: 'Browse and filter news from multiple sources',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="bg-white py-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} My News Aggregator
        </footer>
      </body>
    </html>
  );
}
