import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Custom Vite plugin to handle /api requests locally during dev mode
function serverlessApiPlugin() {
  return {
    name: 'serverless-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next();
        }

        try {
          // Parse url path: /api/analyze -> api/analyze.js
          const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
          let apiPath = parsedUrl.pathname.replace(/^\/api/, '');
          if (apiPath === '' || apiPath === '/') apiPath = '/index';

          const possibleFiles = [
            path.resolve(__dirname, `api${apiPath}.js`),
            path.resolve(__dirname, `api${apiPath}/index.js`)
          ];

          let filePath = possibleFiles.find(f => fs.existsSync(f));

          if (!filePath) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: `API endpoint not found: ${req.url}` }));
          }

          // Handle req body parsing if JSON/form payload
          let body = null;
          if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const rawBody = Buffer.concat(buffers).toString();
            try {
              body = JSON.parse(rawBody);
            } catch {
              body = rawBody;
            }
          }

          req.body = body;
          req.query = Object.fromEntries(parsedUrl.searchParams.entries());

          // Dynamic import of the API route file
          const module = await server.ssrLoadModule(filePath);
          const handler = module.default || module;

          // Polyfill standard Vercel response helpers if needed
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };
          res.send = (data) => {
            if (typeof data === 'object') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            } else {
              res.setHeader('Content-Type', 'text/html');
              res.end(data);
            }
            return res;
          };

          await handler(req, res);
        } catch (err) {
          console.error('API Middleware error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), serverlessApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
