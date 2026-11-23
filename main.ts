// bring-the-humans-03 v2 — "WHILE YOU SLEEP" (Node 22, standard library only).
//
// This little program hands the video in: it reads VIDEO.json from the
// repository root and writes an identical copy to /output/VIDEO.json, where
// the house reads the TikTok address of the ad. That copy is the program's
// whole job; the entry itself is the video, not this file.
//
// The video is a fresh 30-second vertical ad for make.fun, made new for this
// bounty in the recorded session that built it: eight pictures generated in
// that session, an English voiceover, the make.fun brand badge on screen from
// the very first frame, and the press pack's referral end card at the end
// with our own referral code 1aaz13gb typed into its field. Its caption
// carries the bounty's line and our play code makefun-blizzard-lemon-fox.
// The house ranks the video by its real TikTok views; the top 20 share $500.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const SOURCE = join(BOT_DIR, 'VIDEO.json');
const TARGET = join(OUTPUT_DIR, 'VIDEO.json');

if (!existsSync(SOURCE)) {
  console.error(`VIDEO.json not found in ${BOT_DIR}`);
  process.exit(1);
}

const payload = readFileSync(SOURCE, 'utf8');
let parsed: unknown;
try {
  parsed = JSON.parse(payload);
} catch {
  console.error('VIDEO.json is not valid JSON');
  process.exit(1);
}

if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
  console.error('VIDEO.json must hold an object with a string "url"');
  process.exit(1);
}

const videoUrl = (parsed as { url: string }).url;

// A placeholder is not a video yet: warn loudly instead of failing, so the
// file can be committed early and filled in once the ad is posted.
if (!videoUrl.startsWith('https://www.tiktok.com/')) {
  console.warn(`Warning: VIDEO.json does not hold a TikTok address yet (${videoUrl})`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(TARGET, payload);

// Read the copy back and check it matches, so a silent short write is caught.
const writtenBack = readFileSync(TARGET, 'utf8');
if (writtenBack !== payload) {
  console.error('The copy written to /output does not match VIDEO.json');
  process.exit(1);
}

console.log(`VIDEO.json handed in to ${TARGET}: ${videoUrl}`);
