import { vitePlugin as remix } from '@remix-run/dev';
import { vercelPreset } from '@vercel/remix/vite';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeImgSize from 'rehype-img-size';
import rehypeSlug from 'rehype-slug';
import rehypePrism from '@mapbox/rehype-prism';

// Cloudflare Pages sets CF_PAGES=1; pages:build also sets it.
const isCloudflarePages =
  process.env.CF_PAGES === '1' || process.env.PAGES === '1';

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],
  build: {
    assetsInlineLimit: 1024,
  },
  // Bake CF_PAGES into the server bundle so entry.server.jsx can branch.
  define: {
    'process.env.CF_PAGES': JSON.stringify(isCloudflarePages ? '1' : ''),
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  plugins: [
    mdx({
      rehypePlugins: [[rehypeImgSize, { dir: 'public' }], rehypeSlug, rehypePrism],
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      providerImportSource: '@mdx-js/react',
    }),
    remix({
      // Vercel: nodejs bundles under build/server/nodejs-*
      // CF Pages: ESM server at build/server (functions/[[path]].js)
      ...(isCloudflarePages ? {} : { presets: [vercelPreset()] }),
      routes(defineRoutes) {
        return defineRoutes(route => {
          route('/', 'routes/home/route.js', { index: true });
        });
      },
    }),
    jsconfigPaths(),
  ],
});
