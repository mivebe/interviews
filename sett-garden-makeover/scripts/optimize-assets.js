import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { quantize } from '@gltf-transform/functions';
import { execSync } from 'child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'src', 'assets', 'images');
const MODELS_DIR = path.join(ROOT, 'src', 'assets', 'models');
const AUDIO_DIR = path.join(ROOT, 'src', 'assets', 'audio');

const KB = 1024;
const MB = KB * KB;

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

function kb(bytes) { return (bytes / KB).toFixed(0); }
function logSize(name, before, after) {
  console.log(`  ${name}  ${kb(before)} → ${kb(after)} KB  (-${kb(before - after)})`);
}

async function optimizeImages() {
  const pngs = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.png'));
  let saved = 0;

  for (const file of pngs) {
    const maxDim = IMAGE_MAX_SIZES[file];
    if (!maxDim) continue;

    const src = path.join(IMAGES_DIR, file);
    const tmp = src + '.tmp.png';
    const before = fs.statSync(src).size;

    await sharp(src)
      .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toFile(tmp);

    fs.renameSync(tmp, src);
    const after = fs.statSync(src).size;
    saved += before - after;
    logSize(`${file} (resized ≤${maxDim}px)`, before, after);
  }

  return saved;
}

async function optimizeModels() {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const glbs = fs.readdirSync(MODELS_DIR).filter(f => f.endsWith('.glb'));
  let saved = 0;

  for (const file of glbs) {
    const fp = path.join(MODELS_DIR, file);
    const before = fs.statSync(fp).size;
    try {
      const doc = await io.read(fp);
      await doc.transform(quantize());
      await io.write(fp, doc);
      const after = fs.statSync(fp).size;
      saved += before - after;
      logSize(file, before, after);
    } catch (e) {
      console.log(`  ${file}  SKIPPED (${e.message})`);
    }
  }

  return saved;
}

function optimizeAudio() {
  try { execSync('ffmpeg -version', { stdio: 'ignore' }); } catch {
    console.log('  ffmpeg not found, skipping');
    return 0;
  }

  const mp3s = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
  let saved = 0;

  for (const file of mp3s) {
    const fp = path.join(AUDIO_DIR, file);
    const tmp = fp + '.tmp.mp3';
    const before = fs.statSync(fp).size;
    try {
      // 64kbps mono
      execSync(`ffmpeg -y -i "${fp}" -b:a 64k -ac 1 "${tmp}"`, { stdio: 'ignore' });
      fs.renameSync(tmp, fp);
      const after = fs.statSync(fp).size;
      saved += before - after;
      logSize(file, before, after);
    } catch (e) {
      console.log(`  ${file}  FAILED (${e.message})`);
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    }
  }

  return saved;
}

console.log('Images (PNG resize)');
const imageSaved = await optimizeImages();

console.log('\nModels (meshopt quantize)');
const modelSaved = await optimizeModels();

console.log('\nAudio (ffmpeg 64kbps mono)');
const audioSaved = optimizeAudio();

console.log(`\nTotal saved: ${((imageSaved + modelSaved + audioSaved) / MB).toFixed(2)} MB`);
