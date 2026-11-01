// Saathi chat API client. Configure VITE_API_BASE_URL in Vercel project settings.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://medlink-8vbl.onrender.com').replace(/\/$/, '');

export async function sendSaathiMessage(message, history = []) {
  const response = await fetch(`${API_BASE_URL}/api/saathi/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || `Saathi request failed (${response.status})`);
  }
  if (!payload.success || !payload.data?.reply) {
    throw new Error('Saathi returned an unexpected response. Please try again.');
  }
  return payload.data;
}
