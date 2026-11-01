import React, { useRef, useState } from 'react';
import { CheckCircle2, HardDrive, Loader2, UploadCloud } from 'lucide-react';
import Button from '../../ui/Button';
import { DOCUMENT_CATEGORIES } from '../../../lib/adapters';

const MAX_MB = 15; // matches MAX_UPLOAD_SIZE_MB on the backend

export default function RecordActions({ onUpload, usedLabel = '0 B' }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('lab_report');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const pick = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (picked.size > MAX_MB * 1024 * 1024) {
      setError(`That file is larger than the ${MAX_MB} MB limit.`);
      return;
    }
    setError(null);
    setFile(picked);
    setTitle((current) => current || picked.name.replace(/\.[^/.]+$/, ''));
  };

  const submit = async () => {
    if (!file || !title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await onUpload({ file, title: title.trim(), category });
      setFile(null);
      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-dashed border-blue-300 p-5 shadow-xs space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={pick}
          accept=".pdf,.png,.jpg,.jpeg,.webp"
        />

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">Upload New Document</h4>
          <p className="text-xs text-slate-500">PDF, PNG, JPG up to {MAX_MB} MB</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => fileInputRef.current?.click()}
        >
          {file ? file.name : 'Choose file'}
        </Button>

        {file && (
          <div className="space-y-2.5 pt-1">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-400 outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-400 outline-none"
            >
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs font-bold"
              onClick={submit}
              disabled={busy || !title.trim()}
            >
              {busy ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading
                </span>
              ) : (
                'Upload to vault'
              )}
            </Button>
          </div>
        )}

        {error && <p className="text-[11px] text-rose-600 font-medium text-center">{error}</p>}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-blue-600" />
            Storage used
          </span>
          <span className="font-semibold text-slate-500">{usedLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Access is logged in the ABDM audit trail</span>
        </div>
      </div>
    </div>
  );
}
