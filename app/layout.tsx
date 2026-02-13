import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ClaimResolve - Medical Billing Dispute Manager',
  description: 'Value Proposition: Empowers medical practices and billing agencies to efficiently track, manage, and automate communication for patient insurance disputes, reducing administrative burden & improving recovery rates.

Target Customer: Small to medium-sized medical practices, clinics, and independent medical billing companies in the US.

---
Category: Healthcare
Target Market: Small to medium-sized medical practices, clinics, and independent medical billing companies in the US.
Source Hypothesis ID: 95f7cf7b-a6ab-4e45-ba11-d866d9d3f86e
Promotion Type: automatic',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <nav className="border-b">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
              <a href="/" className="font-bold text-lg">ClaimResolve - Medical Billing Dispute Manager</a>
              <div className="flex items-center gap-4">
                <a href="/dashboard" className="text-sm hover:text-blue-600">Dashboard</a>
                <a href="/pricing" className="text-sm hover:text-blue-600">Pricing</a>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
