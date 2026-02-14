'use client';

import { useState } from 'react';
import Link from 'next/link';

type Claim = {
  id: string;
  provider: string;
  serviceDate: string;
  billedAmount: number;
  insurancePaid: number;
  youOwe: number;
  cptCode: string;
  status: 'review' | 'disputing' | 'resolved' | 'won' | 'paid';
  savings?: number;
  issue?: string;
};

const DEMO_CLAIMS: Claim[] = [
  { id: '1', provider: 'City General Hospital', serviceDate: '2026-01-15', billedAmount: 4250, insurancePaid: 2800, youOwe: 1450, cptCode: '99284', status: 'review', issue: 'ER visit billed as Level 4 — typically Level 3 for your symptoms' },
  { id: '2', provider: 'Dr. Smith Radiology', serviceDate: '2026-01-10', billedAmount: 890, insurancePaid: 445, youOwe: 445, cptCode: '74177', status: 'disputing', issue: 'CT scan billed separately from ER visit — should be bundled' },
  { id: '3', provider: 'Valley Lab Services', serviceDate: '2025-12-20', billedAmount: 320, insurancePaid: 160, youOwe: 160, cptCode: '85025', status: 'won', savings: 160, issue: 'Duplicate lab charges — same CBC ordered twice' },
  { id: '4', provider: 'MedPharm Rx', serviceDate: '2025-12-15', billedAmount: 1200, insurancePaid: 600, youOwe: 600, cptCode: 'J7325', status: 'resolved', savings: 400, issue: 'Brand-name drug billed when generic was dispensed' },
  { id: '5', provider: 'Sunrise Urgent Care', serviceDate: '2025-11-30', billedAmount: 350, insurancePaid: 280, youOwe: 70, cptCode: '99213', status: 'paid' },
  { id: '6', provider: 'Metro Anesthesia', serviceDate: '2026-01-15', billedAmount: 3100, insurancePaid: 1800, youOwe: 1300, cptCode: '00142', status: 'review', issue: 'Out-of-network provider used during in-network procedure — balance billing prohibited in your state' },
];

export default function ClaimsPage() {
  const [filter, setFilter] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = filter === 'all' ? DEMO_CLAIMS : DEMO_CLAIMS.filter(c => c.status === filter);
  const totalOwed = DEMO_CLAIMS.filter(c => c.status !== 'paid' && c.status !== 'won').reduce((s, c) => s + c.youOwe, 0);
  const totalSaved = DEMO_CLAIMS.reduce((s, c) => s + (c.savings || 0), 0);
  const disputeReady = DEMO_CLAIMS.filter(c => c.issue && c.status === 'review').length;

  const statusColors: Record<string, string> = {
    review: 'bg-yellow-50 text-yellow-700',
    disputing: 'bg-blue-50 text-blue-700',
    resolved: 'bg-green-50 text-green-700',
    won: 'bg-emerald-50 text-emerald-700',
    paid: 'bg-gray-50 text-gray-500',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">← Dashboard</Link>
          <h1 className="font-bold text-lg">Medical Claims</h1>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-black text-white text-sm rounded-lg">
          + Add Claim
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-400 uppercase">Outstanding</p>
            <p className="text-2xl font-bold text-red-600">${totalOwed.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-400 uppercase">Total Saved</p>
            <p className="text-2xl font-bold text-green-600">${totalSaved.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-400 uppercase">Active Claims</p>
            <p className="text-2xl font-bold">{DEMO_CLAIMS.length}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-orange-500 uppercase">Dispute Ready</p>
            <p className="text-2xl font-bold text-orange-600">{disputeReady}</p>
            <p className="text-xs text-gray-400 mt-1">Issues detected</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {['all', 'review', 'disputing', 'resolved', 'won', 'paid'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium capitalize ${filter === s ? 'bg-black text-white' : 'bg-white border text-gray-600'}`}>
              {s === 'all' ? 'All Claims' : s}
            </button>
          ))}
        </div>

        {/* Claims */}
        <div className="space-y-3">
          {filtered.map(claim => (
            <div key={claim.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{claim.provider}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[claim.status]}`}>
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Service: {claim.serviceDate} · CPT: {claim.cptCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${claim.youOwe.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">of ${claim.billedAmount.toLocaleString()} billed</p>
                </div>
              </div>
              {claim.issue && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
                  <p className="text-sm text-amber-800">🔍 <strong>Issue Found:</strong> {claim.issue}</p>
                  {claim.status === 'review' && (
                    <button className="mt-2 px-3 py-1 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700">
                      Generate Dispute Letter
                    </button>
                  )}
                </div>
              )}
              {claim.savings && claim.savings > 0 && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  <p className="text-sm text-green-700">💰 Saved <strong>${claim.savings.toLocaleString()}</strong></p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
