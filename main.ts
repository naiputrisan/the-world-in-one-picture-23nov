// The World in One Page — Monday 23 November 2026.
// Entry program for make.fun news-image-20261123.
// The poster was drawn once, checked by eye at full size and at 300px,
// and saved next to this file as entry.png (a JPEG by its first bytes).
// All this program does is place that exact image at the output path
// the competition asks for, so both runs write identical bytes.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "entry.png");
const OUT_DIR = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const TARGET = join(OUT_DIR, "entry.png");

function fail(message: string): never {
  console.error(`entry: ${message}`);
  process.exit(1);
}

function main(): void {
  if (!existsSync(SOURCE)) fail(`missing image next to this program: ${SOURCE}`);
  const original = readFileSync(SOURCE);
  if (original.length > 1_048_576) fail(`image is ${original.length} bytes, over the 1 MiB limit`);
  const isJpeg = original[0] === 0xff && original[1] === 0xd8 && original[2] === 0xff;
  const isPng = original[0] === 0x89 && original[1] === 0x50;
  if (!isJpeg && !isPng) fail("image is neither JPEG nor PNG by its first bytes");
  mkdirSync(OUT_DIR, { recursive: true });
  copyFileSync(SOURCE, TARGET);
  const written = readFileSync(TARGET);
  if (!written.equals(original)) fail("copied bytes differ from the source image");
  console.log(`entry: wrote ${TARGET} (${written.length} bytes)`);
}

main();
