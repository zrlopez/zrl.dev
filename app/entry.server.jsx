import cloudflareHandler from './entry.server.cloudflare.jsx';
import vercelHandler from './entry.server.vercel.jsx';

// CF_PAGES is inlined at build time (see vite.config.js define).
const isCloudflarePages = process.env.CF_PAGES === '1';

export default isCloudflarePages ? cloudflareHandler : vercelHandler;
