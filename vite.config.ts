import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

// Quick utility to copy dir recursively
function copyDirRecursiveSync(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Plugin to copy public uploads and images to dist/ so they are guaranteed to exist in production
function copyPublicAssetsPlugin() {
  return {
    name: 'copy-public-assets',
    closeBundle() {
      const srcUploads = path.resolve(__dirname, 'public/uploads');
      const destUploads = path.resolve(__dirname, 'dist/uploads');
      if (fs.existsSync(srcUploads)) {
        copyDirRecursiveSync(srcUploads, destUploads);
        console.log('Copy public/uploads to dist/uploads succeeded!');
      }
      const srcImages = path.resolve(__dirname, 'public/images');
      const destImages = path.resolve(__dirname, 'dist/images');
      if (fs.existsSync(srcImages)) {
        copyDirRecursiveSync(srcImages, destImages);
        console.log('Copy public/images to dist/images succeeded!');
      }
    }
  };
}

// 2. Plugin to persist customized contents during development session
function saveToSourcePlugin() {
  return {
    name: 'save-to-source-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method === 'POST' && req.url === '/api/save-to-source') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
               const data = JSON.parse(body);
               const dataDir = path.resolve(__dirname, 'src/data');
               if (!fs.existsSync(dataDir)) {
                 fs.mkdirSync(dataDir, { recursive: true });
               }

               if (data.projects) {
                 fs.writeFileSync(
                   path.join(dataDir, 'uploaded_projects.json'),
                   JSON.stringify(data.projects, null, 2),
                   'utf-8'
                 );
               }
               if (data.practiceWorks) {
                 fs.writeFileSync(
                   path.join(dataDir, 'uploaded_practice.json'),
                   JSON.stringify(data.practiceWorks, null, 2),
                   'utf-8'
                 );
               }
               if (data.footerLinks) {
                 fs.writeFileSync(
                   path.join(dataDir, 'uploaded_footer.json'),
                   JSON.stringify(data.footerLinks, null, 2),
                   'utf-8'
                 );
               }

               res.writeHead(200, { 'Content-Type': 'application/json' });
               res.end(JSON.stringify({ success: true, message: 'Configuration persistently written to source code!' }));
            } catch (err: any) {
               res.writeHead(500, { 'Content-Type': 'application/json' });
               res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/',
    plugins: [react(), tailwindcss(), copyPublicAssetsPlugin(), saveToSourcePlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
