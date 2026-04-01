import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

const staticProjectMappings: Record<string, { root: string; indexFile?: string }> = {
  "sett-garden-makeover": { root: "../sett-garden-makeover/dist" },
  "gong-game": { root: "../gong-game" },
  "barchart-live-coding": { root: "../barchart-live-coding", indexFile: "draw.html" },
  "kanbanize-app": { root: "../kanbanize-app" },
};

/** Resolve /code-files/{project}/{file} to ../{project}/{file} */
const CODE_FILES_PREFIX = "/code-files/";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".csv": "text/csv",
};

function serveCodeFiles(): Plugin {
  return {
    name: "serve-code-files",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith(CODE_FILES_PREFIX)) return next();

        const relPath = decodeURIComponent(url.slice(CODE_FILES_PREFIX.length));
        const absPath = path.resolve(__dirname, "..", relPath);

        if (fs.existsSync(absPath) && fs.statSync(absPath).isFile()) {
          const ext = path.extname(absPath).toLowerCase();
          res.setHeader("Content-Type", MIME_TYPES[ext] || "text/plain");
          fs.createReadStream(absPath).pipe(res);
        } else {
          next();
        }
      });
    },
  };
}

function serveStaticProjects(): Plugin {
  return {
    name: "serve-static-projects",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        const match = url.match(/^\/projects\/([^/?#]+)(\/[^?#]*)?/);
        if (!match) return next();

        const projectId = match[1];
        const mapping = staticProjectMappings[projectId];

        if (!mapping) {
          // Buildable project — show dev notice
          res.setHeader("Content-Type", "text/html");
          res.statusCode = 200;
          res.end(`<!DOCTYPE html>
<html><body style="background:#0a0a1a;color:#e0e0e0;font-family:sans-serif;padding:40px;text-align:center">
  <h1>${projectId}</h1>
  <p style="color:#888;max-width:500px;margin:16px auto">This project requires its own build and is not available in dashboard dev mode.</p>
  <p style="color:#888">Run its dev server separately, or view it on the deployed site.</p>
  <a href="/" style="color:#1668dc;font-size:1.1rem">Back to Dashboard</a>
</body></html>`);
          return;
        }

        let filePath = match[2] ?? "/";
        if (filePath.endsWith("/")) {
          filePath += mapping.indexFile ?? "index.html";
        }

        const absPath = path.resolve(__dirname, mapping.root, "." + filePath);

        if (fs.existsSync(absPath) && fs.statSync(absPath).isFile()) {
          const ext = path.extname(absPath).toLowerCase();
          if (MIME_TYPES[ext]) {
            res.setHeader("Content-Type", MIME_TYPES[ext]);
          }
          fs.createReadStream(absPath).pipe(res);
        } else {
          next();
        }
      });
    },
  };
}

/** Copy code files referenced in projects.ts into dist/code-files/ at build time */
function copyCodeFiles(): Plugin {
  return {
    name: "copy-code-files",
    writeBundle() {
      // Lazy-import project data to find all codeFile paths
      const codeFilePaths = [
        "kanbanize-app/task_1/task_1.js",
        "kanbanize-app/task_2/task_2.js",
        "kpmg-live-coding/longestString.js",
        "kpmg-live-coding/longestString.test.js",
        "csv-processing-task/.csv parse function.txt",
        "csv-processing-task/export to csv.html",
        "csv-processing-task/process CSV Node.js",
        "thinkmarkets-live-coding/index.jsx",
        "thinkmarkets-live-coding/livecoding_task.txt",
        "unknown-live-coding/Single_Linked_List.js",
        "unknown-live-coding/Double_Linked_List.js",
        "unknown-live-coding/Circular_Linked_List.js",
        "unknown-live-coding/currying.js",
        "unknown-live-coding/oop-context-change.js",
      ];

      for (const filePath of codeFilePaths) {
        const src = path.resolve(__dirname, "..", filePath);
        const dest = path.resolve(__dirname, "dist", "code-files", filePath);
        if (fs.existsSync(src)) {
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.copyFileSync(src, dest);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), serveCodeFiles(), serveStaticProjects(), copyCodeFiles()],
  build: {
    outDir: "dist",
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
});
