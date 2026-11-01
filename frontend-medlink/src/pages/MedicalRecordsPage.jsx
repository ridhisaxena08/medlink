import React, { useMemo, useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import RecordTabs from '../components/features/records/RecordTabs';
import RecordRow from '../components/features/records/RecordRow';
import RecordActions from '../components/features/records/RecordActions';
import { EmptyState, ErrorState, Spinner } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { documents } from '../lib/api';
import { adaptDocument, formatBytes } from '../lib/adapters';

export default function MedicalRecordsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [notice, setNotice] = useState(null);

  const { data, error, loading, reload } = useAsync(() => documents.mine({ limit: 100 }), []);
  const records = useMemo(() => (data || []).map(adaptDocument), [data]);

  const filtered = records.filter((r) => activeCategory === 'All' || r.category === activeCategory);

  const categoryCounts = records.reduce((acc, r) => {
    acc.All = (acc.All || 0) + 1;
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  const usedBytes = (data || []).reduce((sum, d) => sum + (d.sizeBytes || 0), 0);

  const handleUpload = async ({ file, title, category }) => {
    await documents.upload({ file, title, category });
    setNotice(`"${title}" uploaded.`);
    setTimeout(() => setNotice(null), 5000);
    await reload();
  };

  /** The download route needs the bearer token, so stream it and save the blob. */
  const handleDownload = async (record) => {
    try {
      const blob = await documents.download(record.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = record.title;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleView = async (record) => {
    try {
      const blob = await documents.download(record.id);
      window.open(URL.createObjectURL(blob), '_blank', 'noopener');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (record) => {
    if (!confirm(`Remove "${record.title}" from your vault?`)) return;
    try {
      await documents.archive(record.id);
      await reload();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ABHA Medical Records & Vault"
        description="Encrypted repository of your prescriptions, lab reports, discharge summaries, and vaccine passes."
        badgeText={`${records.length} Documents`}
      />

      {notice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-700">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <RecordTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            counts={categoryCounts}
          />

          <div className="space-y-3 pt-2">
            {loading ? (
              <Spinner label="Opening your vault..." />
            ) : error ? (
              <ErrorState error={error} onRetry={reload} />
            ) : filtered.length === 0 ? (
              <EmptyState
                title={records.length === 0 ? 'Your vault is empty' : 'Nothing in this category'}
                description="Upload a prescription, lab report or scan using the panel on the right."
              />
            ) : (
              filtered.map((record) => (
                <RecordRow
                  key={record.id}
                  record={record}
                  onDownload={handleDownload}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>

        <div>
          <RecordActions onUpload={handleUpload} usedLabel={formatBytes(usedBytes)} />
        </div>
      </div>
    </div>
  );
}
