#!/usr/bin/env bun

import { parse } from "node-html-parser";
import fs from "fs/promises";
import path from "path";

const HTML_FILE = "test.html"; // Change this to your HTML file
const OUTPUT_DIR = "images";

async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);

    const buffer = await response.arrayBuffer();
    await fs.writeFile(path.join(OUTPUT_DIR, filename), Buffer.from(buffer));
    console.log(`✅ Downloaded: ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to download ${url}:`, error);
  }
}

async function main() {
  try {
    // Create output directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Read HTML file
    const html = await fs.readFile(HTML_FILE, "utf-8");

    // Parse HTML
    const root = parse(html);
    const imgTags = root.querySelectorAll("img");

    console.log(`Found ${imgTags.length} image tags`);

    const downloads: Promise<void>[] = [];

    for (const img of imgTags) {
      let src = img.getAttribute("src")?.trim();

      if (!src) continue;

      // Handle relative URLs (basic support)
      if (src.startsWith("//")) {
        src = "https:" + src;
      } else if (src.startsWith("/")) {
        // You may need to adjust base URL for relative paths
        console.warn(`⚠️  Relative path: ${src} (may need base URL)`);
        continue; // Skip for now or implement base URL logic
      }

      if (!src.startsWith("http")) continue;

      // Generate filename from URL or use index
      const ext = path.extname(src).split("?")[0] || ".jpg";
      const filename = `image-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

      downloads.push(downloadImage(src, filename));
    }

    await Promise.all(downloads);
    console.log(`\n🎉 Done! Images saved to ./${OUTPUT_DIR}/`);

  } catch (error) {
    console.error("Error:", error);
  }
}

main();