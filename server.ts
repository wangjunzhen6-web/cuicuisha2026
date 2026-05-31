import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Dynamically resolve directory name to be fully robust for ESM (tsx) and CJS (compiled esbuild)
const getResolvedDirname = () => {
  if (typeof __dirname !== 'undefined' && __dirname) {
    return __dirname;
  }
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch (err) {
    return process.cwd();
  }
};

const resolvedDirname = getResolvedDirname();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Simple request logging middleware
  app.use((req, res, next) => {
    console.log(`[Server Log] ${req.method} ${req.url} | Content-Length: ${req.headers['content-length']} | IP: ${req.ip}`);
    next();
  });

  // Use JSON middleware with extremely generous limits to handle large Base64 images and MP4 videos
  app.use(express.json({ limit: '150mb' }));
  app.use(express.urlencoded({ limit: '150mb', extended: true }));

  // API router goes here FIRST
  app.post('/api/upload', (req, res, next) => {
    try {
      const { filename, base64 } = req.body;
      if (!filename || !base64) {
        return res.status(400).json({ success: false, error: 'Missing filename or base64 data' });
      }

      // Check and decode raw or data-URI base64 formats
      let buffer: Buffer;
      let ext = path.extname(filename) || '';
      const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
        if (!ext) {
          const mimeParts = mimeType.split('/');
          ext = '.' + (mimeParts[1] || 'png');
        }
      } else {
        buffer = Buffer.from(base64, 'base64');
      }

      // Format a robust safe filename
      const cleanName = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const nameWithoutExt = path.parse(cleanName).name;
      const finalFilename = `${Date.now()}_${nameWithoutExt}${ext}`;

      const uploadsDir = path.resolve(resolvedDirname, 'public/uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, finalFilename);
      fs.writeFileSync(filePath, buffer);
      console.log(`[Server] Image/Video uploaded successfully: ${finalFilename}`);

      res.status(200).json({
        success: true,
        url: `/uploads/${finalFilename}`
      });
    } catch (err: any) {
      console.error('[Server] Asset upload error:', err);
      next(err);
    }
  });

  // Serve static uploads locally and instantly
  const uploadsDir = path.resolve(resolvedDirname, 'public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  app.post('/api/save-to-source', (req, res, next) => {
    try {
      console.log('[Server] Received save request. Body keys:', Object.keys(req.body));
      const data = req.body;
      const dataDir = path.resolve(resolvedDirname, 'src/data');
      
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (data.projects) {
        fs.writeFileSync(
          path.join(dataDir, 'uploaded_projects.json'),
          JSON.stringify(data.projects, null, 2),
          'utf-8'
        );
        console.log('[Server] Successfully wrote uploaded_projects.json');
      }
      if (data.practiceWorks) {
        fs.writeFileSync(
          path.join(dataDir, 'uploaded_practice.json'),
          JSON.stringify(data.practiceWorks, null, 2),
          'utf-8'
        );
        console.log('[Server] Successfully wrote uploaded_practice.json');
      }
      if (data.footerLinks) {
        fs.writeFileSync(
          path.join(dataDir, 'uploaded_footer.json'),
          JSON.stringify(data.footerLinks, null, 2),
          'utf-8'
        );
        console.log('[Server] Successfully wrote uploaded_footer.json');
      }

      res.status(200).json({ success: true, message: 'Configuration persistently written to source code!' });
    } catch (err: any) {
      console.error('[Server] Save processing error:', err);
      next(err);
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development or serving built assets
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler to guarantee JSON responses (never HTML) for errors in API execution
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Server Error Middleware Caught]:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'An unexpected server error occurred',
      details: err.stack ? err.stack.toString() : err.toString()
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
