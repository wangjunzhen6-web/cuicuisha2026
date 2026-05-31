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

// 1. Plugin to copy assets to dist so `/src/assets/images/` path works perfectly in production
function copyAssetsPlugin() {
  return {
    name: 'copy-src-assets',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'src/assets/images');
      const destDir = path.resolve(__dirname, 'dist/src/assets/images');
      if (fs.existsSync(srcDir)) {
        copyDirRecursiveSync(srcDir, destDir);
        console.log('Copy src/assets/images to dist/src/assets/images succeeded!');
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
    plugins: [react(), tailwindcss(), copyAssetsPlugin(), saveToSourcePlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
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
