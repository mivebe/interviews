#!/bin/bash
set -e

echo "=== Building Interview Portfolio ==="

# 1. Build the dashboard (shell app)
echo ">>> Building dashboard..."
cd dashboard
npm ci --no-fund
npx tsc -b && npx vite build
cd ..
echo ">>> Dashboard built."

mkdir -p dashboard/dist/projects

# 2. Build excitel-countries (Vite)
echo ">>> Building excitel-countries..."
cd excitel-countries/client
npm ci --no-fund
npx vite build
mkdir -p ../../dashboard/dist/projects/excitel-countries
cp -r dist/* ../../dashboard/dist/projects/excitel-countries/
cd ../..
echo ">>> excitel-countries built."

# 3. Build kraken-app client (Vite)
echo ">>> Building kraken-app..."
cd kraken-app/client
npm ci --no-fund
npx tsc -b && npx vite build
mkdir -p ../../dashboard/dist/projects/kraken-app
cp -r dist/* ../../dashboard/dist/projects/kraken-app/
cd ../..
echo ">>> kraken-app built."

# 4. Build proxiad-buildings (CRA)
echo ">>> Building proxiad-buildings..."
cd proxiad-buildings
npm install --no-fund
PUBLIC_URL=/projects/proxiad-buildings npx react-scripts build
mkdir -p ../dashboard/dist/projects/proxiad-buildings
cp -r build/* ../dashboard/dist/projects/proxiad-buildings/
cd ..
echo ">>> proxiad-buildings built."

# 5. Build softgames-ace-of-shadows (Vite)
echo ">>> Building softgames-ace-of-shadows..."
cd softgames-ace-of-shadows
npm ci --no-fund
npx tsc && npx vite build
mkdir -p ../dashboard/dist/projects/softgames-ace-of-shadows
cp -r dist/* ../dashboard/dist/projects/softgames-ace-of-shadows/
cd ..
echo ">>> softgames-ace-of-shadows built."

# 6. Build expensify-app (Vite)
echo ">>> Building expensify-app..."
cd expensify-app/client
npm ci --no-fund
npx vite build
mkdir -p ../../dashboard/dist/projects/expensify-app
cp -r dist/* ../../dashboard/dist/projects/expensify-app/
cd ../..
echo ">>> expensify-app built."

# 7. Build sett-garden-makeover (Vite single-file)
echo ">>> Building sett-garden-makeover..."
cd sett-garden-makeover
npm ci --no-fund
npx vite build
mkdir -p ../dashboard/dist/projects/sett-garden-makeover
cp dist/index.html ../dashboard/dist/projects/sett-garden-makeover/
cd ..
echo ">>> sett-garden-makeover built."

# 8. Copy gong-game (vanilla, no build)
echo ">>> Copying gong-game..."
mkdir -p dashboard/dist/projects/gong-game
cp gong-game/index.html gong-game/app.js gong-game/style.css dashboard/dist/projects/gong-game/
cp gong-game/pixi_excercise_gong.jpg dashboard/dist/projects/gong-game/ 2>/dev/null || true
echo ">>> gong-game copied."

# 9. Copy barchart-live-coding (static HTML)
echo ">>> Copying barchart-live-coding..."
mkdir -p dashboard/dist/projects/barchart-live-coding
cp barchart-live-coding/draw.html dashboard/dist/projects/barchart-live-coding/index.html
cp barchart-live-coding/draw.js barchart-live-coding/draw.css dashboard/dist/projects/barchart-live-coding/
echo ">>> barchart-live-coding copied."

# 10. Copy kanbanize-app static tasks
echo ">>> Copying kanbanize-app..."
mkdir -p dashboard/dist/projects/kanbanize-app/task_3
mkdir -p dashboard/dist/projects/kanbanize-app/task_4
cp kanbanize-app/index.html dashboard/dist/projects/kanbanize-app/
cp kanbanize-app/task_3/task_3.html kanbanize-app/task_3/task_3.js dashboard/dist/projects/kanbanize-app/task_3/
cp kanbanize-app/task_4/task_4.html kanbanize-app/task_4/task_4.js kanbanize-app/task_4/task_4.css kanbanize-app/task_4/card_data.csv dashboard/dist/projects/kanbanize-app/task_4/
echo ">>> kanbanize-app copied."

# 11. Copy code-only source files for runtime display
echo ">>> Copying code-only files..."
mkdir -p dashboard/dist/code-files
cp -r csv-processing-task dashboard/dist/code-files/
cp -r kpmg-live-coding dashboard/dist/code-files/
cp -r thinkmarkets-live-coding dashboard/dist/code-files/
cp -r unknown-live-coding dashboard/dist/code-files/
echo ">>> code-only files copied."

echo "=== Build complete! ==="
