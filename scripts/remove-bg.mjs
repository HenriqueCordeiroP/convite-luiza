import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicAssets = path.join(root, "public", "assets");

const THRESHOLD = 45; // pixels com R,G,B <= 45 viram transparentes

const sources = [
  path.join(publicAssets, "22_balloon.png"),
  path.join(
    "/Users/los/.cursor/projects/Users-los-Documents-graduation-bytes/assets",
    "22_lu-6918053c-c655-492a-ad3c-05207fd4db79.png"
  ),
];

let inputPath = sources.find((p) => existsSync(p));
if (!inputPath) {
  console.error("Nenhuma imagem 22 encontrada.");
  process.exit(1);
}

const outputPath = path.join(publicAssets, "22_balloon.png");

const { data, info } = await sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (r <= THRESHOLD && g <= THRESHOLD && b <= THRESHOLD) {
    data[i + 3] = 0;
  }
}

await sharp(data, { raw: { width, height, channels } })
  .png()
  .toFile(outputPath);

console.log("PNG com fundo transparente salvo em:", outputPath);
