# Swasthya Setu — A BRIDGE TOWARDS HEALTH

This is a small integration bundle for adding the Saathi chat widget to the EXISTING Vercel frontend. It is not a replacement for the entire existing website.

## Files
- `frontend/src/components/features/saathi/SaathiChat.jsx` — Saathi floating chat widget.
- `frontend/src/services/saathiApi.js` — dedicated chat API client; separate file to avoid overwriting the existing API service.
- `frontend/APP-INTEGRATION-SNIPPET.jsx.txt` — exact steps to merge into the existing app.

## Important
1. Copy these files into the matching paths in the existing GitHub repository. If the repository uses a different frontend root, adjust the paths accordingly.
2. Do NOT replace the existing `App.jsx`, API service, package.json, or Vercel config wholesale. Merge the two App.jsx additions shown in the snippet.
3. Set `VITE_API_BASE_URL=https://medlink-8vbl.onrender.com` in the existing Vercel project's Environment Variables, then redeploy.
4. `lucide-react` must be installed in the existing frontend if not already present.
5. The existing Render backend must support `POST /api/saathi/chat`. This bundle does not guarantee that the current live backend supports that route; test it after deployment.

No API keys or secrets are included in this bundle.
