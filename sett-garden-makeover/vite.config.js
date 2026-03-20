import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { basename } from 'path';

const IMAGE_MAX_SIZES = {
  'intro.png': 800,
  'logo.png': 400,
  'play.png': 400,
  'frame.png': 256,
  'cart.png': 256,
  'swing.png': 256,
  'table.png': 256,
  'arrow.png': 128,
  'checkmark.png': 128,
  'chicken.png': 128,
  'cow.png': 128,
  'corn.png': 128,
  'cursor.png': 128,
  'grapes.png': 128,
  'plus.png': 128,
  'sheep.png': 128,
  'strawberry.png': 128,
  'tomato.png': 128,
};

function pngToWebp() {
  let isBuild = false;

  return {
    name: 'png-to-webp',
    enforce: 'pre',

    configResolved(config) {
      isBuild = config.command === 'build';
    },

    async load(id) {
      if (!isBuild) return null;

      const [filePath, query] = id.split('?');
      if (!filePath.endsWith('.png') || !query?.includes('url')) return null;

      const sharp = (await import('sharp')).default;

      let pipeline = sharp(filePath);
      const maxDim = IMAGE_MAX_SIZES[basename(filePath)];
      if (maxDim) {
        pipeline = pipeline.resize(maxDim, maxDim, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      const webpBuffer = await pipeline.webp({ quality: 80 }).toBuffer();
      const dataUri = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
      return `export default "${dataUri}";`;
    },
  };
}

export default defineConfig({
  plugins: [pngToWebp(), viteSingleFile()],
  publicDir: false,
  build: {
    assetsInlineLimit: 100 * 1024 * 1024, // 100MB — inline everything as data URIs
    target: 'esnext',
  },
  server: {
    open: true,
  },
});
