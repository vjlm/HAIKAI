import React from 'react';
import { Certification, AwardItem } from '../../types/resume';
import { Plus, Trash2, Award, ShieldCheck } from 'lucide-react';

interface Props {
  certifications: Certification[];
  awards: AwardItem[];
  onCertificationsChange: (certs: Certification[]) => void;
  onAwardsChange: (awards: AwardItem[]) => void;
}

export const CertificationsEditor: React.FC<Props> = ({
  certifications,
  awards,
  onCertificationsChange,
  onAwardsChange
}) => {
  const handleAddCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: 'Certification Name',
      issuer: 'Issuing Organization',
      issueDate: '2023-06',
      credentialId: 'ABC-12345'
    };
    onCertificationsChange([...certifications, newCert]);
  };

  const handleUpdateCert = (id: string, updates: Partial<Certification>) => {
    onCertificationsChange(certifications.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteCert = (id: string) => {
    onCertificationsChange(certifications.filter(c => c.id !== id));
  };

  const handleAddAward = () => {
    const newAward: AwardItem = {
      id: `award-${Date.now()}`,
      title: 'Award / Honor Title',
      issuer: 'Organization',
      date: '2023',
      description: 'Recognized for outstanding technical contribution or leadership.'
    };
    onAwardsChange([...awards, newAward]);
  };

  const handleUpdateAward = (id: string, updates: Partial<AwardItem>) => {
    onAwardsChange(awards.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const handleDeleteAward = (id: string) => {
    onAwardsChange(awards.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Certifications */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Certifications & Licenses</span>
            </h3>
            <p className="text-xs text-slate-500">Industry credentials (e.g. AWS, GCP, CKA, PMP).</p>
          </div>
          <button
            type="button"
            onClick={handleAddCert}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certificate</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {certifications.map((c) => (
            <div key={c.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => handleUpdateCert(c.id, { name: e.target.value })}
                  placeholder="Certificate Name"
                  className="font-bold text-xs text-slate-900 flex-1 px-2 py-1 border border-slate-200 rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteCert(c.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={c.issuer}
                  onChange={(e) => handleUpdateCert(c.id, { issuer: e.target.value })}
                  placeholder="Issuing Authority (e.g. Amazon Web Services)"
                  className="text-xs px-2 py-1 border border-slate-200 rounded text-slate-800"
                />
                <input
                  type="text"
                  value={c.issueDate}
                  onChange={(e) => handleUpdateCert(c.id, { issueDate: e.target.value })}
                  placeholder="Date (e.g. 2023-05)"
                  className="text-xs px-2 py-1 border border-slate-200 rounded text-slate-800"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Honors & Awards</span>
            </h3>
            <p className="text-xs text-slate-500">Hackathon wins, company excellence awards, scholarships.</p>
          </div>
          <button
            type="button"
            onClick={handleAddAward}
            className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Award</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {awards.map((a) => (
            <div key={a.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={a.title}
                  onChange={(e) => handleUpdateAward(a.id, { title: e.target.value })}
                  placeholder="Award Title"
                  className="font-bold text-xs text-slate-900 flex-1 px-2 py-1 border border-slate-200 rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteAward(a.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={a.issuer}
                  onChange={(e) => handleUpdateAward(a.id, { issuer: e.target.value })}
                  placeholder="Organization"
                  className="text-xs px-2 py-1 border border-slate-200 rounded text-slate-800"
                />
                <input
                  type="text"
                  value={a.date}
                  onChange={(e) => handleUpdateAward(a.id, { date: e.target.value })}
                  placeholder="Date / Year"
                  className="text-xs px-2 py-1 border border-slate-200 rounded text-slate-800"
                />
              </div>
              <input
                type="text"
                value={a.description}
                onChange={(e) => handleUpdateAward(a.id, { description: e.target.value })}
                placeholder="Brief achievement context..."
                className="w-full text-xs px-2 py-1 border border-slate-200 rounded text-slate-800"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
