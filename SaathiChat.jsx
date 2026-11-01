import React, { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, X, Send, LoaderCircle, Sparkles, AlertCircle } from 'lucide-react';
import { sendSaathiMessage } from '../../../services/saathiApi';

const greeting = {
  role: 'assistant',
  text: 'Namaste! I’m Saathi, your Swasthya Setu health-information companion. I can explain general health topics and help you navigate the app. I can’t diagnose or prescribe. What would you like help understanding?',
};

const suggestions = ['How can I prepare for a doctor visit?', 'What information should a prescription include?', 'When should I seek urgent medical help?'];

export default function SaathiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([greeting]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      inputRef.current?.focus();
    }
  }, [open, messages, busy]);

  async function send(text = input) {
    const message = text.trim();
    if (!message || busy) return;
    const previous = messages.filter((item) => item !== greeting).slice(-12);
    setMessages((current) => [...current, { role: 'user', text: message }]);
    setInput('');
    setError('');
    setBusy(true);
    try {
      const data = await sendSaathiMessage(message, previous.map((item) => ({
        role: item.role === 'assistant' ? 'model' : 'user', text: item.text,
      })));
      setMessages((current) => [...current, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      setError(err.message || 'Could not reach Saathi. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100] font-sans">
      {open && (
        <section aria-label="Saathi health assistant" className="mb-3 flex h-[min(650px,calc(100dvh-110px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <header className="flex items-center gap-3 bg-gradient-to-r from-teal-700 to-emerald-600 px-4 py-4 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15"><Bot className="h-6 w-6" /></div>
            <div className="min-w-0 flex-1"><div className="flex items-center gap-2 font-bold">Saathi <Sparkles className="h-4 w-4" /></div><p className="text-xs text-teal-50">Swasthya Setu health companion</p></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close Saathi" className="rounded-xl p-2 hover:bg-white/15"><X className="h-5 w-5" /></button>
          </header>
          <div className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-[11px] leading-4 text-amber-900">General health information only — not a diagnosis or substitute for a clinician. Emergency in India? Call 112.</div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
            {messages.map((item, index) => (
              <div key={`${index}-${item.role}`} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-3 text-sm leading-5 ${item.role === 'user' ? 'rounded-br-md bg-teal-700 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm'}`}>
                  {item.text}
                </div>
              </div>
            ))}
            {busy && <div className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin" /> Saathi is thinking…</div>}
            {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"><div className="mb-1 flex items-center gap-1 font-semibold"><AlertCircle className="h-4 w-4" /> Message not sent</div>{error}<button type="button" onClick={() => send(messages[messages.length - 1]?.role === 'user' ? messages[messages.length - 1].text : input)} className="ml-2 font-bold underline">Retry</button></div>}
            {messages.length === 1 && <div className="space-y-2 pt-1">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => send(suggestion)} disabled={busy} className="block w-full rounded-xl border border-teal-100 bg-white px-3 py-2 text-left text-xs text-teal-800 transition hover:border-teal-300 hover:bg-teal-50 disabled:opacity-50">{suggestion}</button>)}</div>}
            <div ref={endRef} />
          </div>
          <form onSubmit={(event) => { event.preventDefault(); send(); }} className="flex items-end gap-2 border-t border-slate-200 bg-white p-3">
            <textarea ref={inputRef} value={input} onChange={(event) => setInput(event.target.value.slice(0, 4000))} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } }} rows={1} maxLength={4000} placeholder="Ask Saathi a question…" aria-label="Message Saathi" className="max-h-28 min-h-11 flex-1 resize-y rounded-2xl border border-slate-200 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
            <button type="submit" disabled={!input.trim() || busy} aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button>
          </form>
          <div className="px-3 pb-2 text-center text-[10px] text-slate-400">Avoid sharing passwords, Aadhaar/ABHA numbers, or identifying details.</div>
        </section>
      )}
      {!open && <button type="button" onClick={() => setOpen(true)} aria-label="Open Saathi health assistant" className="flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3.5 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200"><MessageCircle className="h-5 w-5" /> Ask Saathi</button>}
    </div>
  );
}
