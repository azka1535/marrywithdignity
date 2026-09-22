const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Favicon SVG - Bold, iconic emblem with squircle container
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B"/>
      <stop offset="40%" stop-color="#065F46"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7"/>
      <stop offset="25%" stop-color="#FBBF24"/>
      <stop offset="65%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FDE68A"/>
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background Squircle / Shield -->
  <rect width="512" height="512" rx="120" fill="url(#bgGrad)"/>
  <rect width="492" height="492" x="10" y="10" rx="110" fill="none" stroke="url(#goldGrad)" stroke-width="4" opacity="0.45"/>

  <!-- Top Sparkles -->
  <g fill="url(#goldGrad)" filter="url(#softGlow)">
    <path d="M 256 68 Q 256 94 238 102 Q 256 110 256 136 Q 256 110 274 102 Q 256 94 256 68 Z"/>
    <path d="M 212 94 Q 212 106 202 110 Q 212 114 212 126 Q 212 114 222 110 Q 212 106 212 94 Z" opacity="0.85"/>
    <path d="M 300 94 Q 300 106 290 110 Q 300 114 300 126 Q 300 114 310 110 Q 300 106 300 94 Z" opacity="0.85"/>
  </g>

  <!-- Interlocking Golden Wedding Rings -->
  <g id="rings">
    <!-- Left Ring -->
    <ellipse cx="216" cy="206" rx="58" ry="58" fill="none" stroke="url(#goldGrad)" stroke-width="19" stroke-linecap="round"/>
    <!-- Right Ring -->
    <ellipse cx="296" cy="206" rx="58" ry="58" fill="none" stroke="url(#goldGrad)" stroke-width="19" stroke-linecap="round"/>
    <!-- Ring Shine Highlight -->
    <path d="M 174 180 A 58 58 0 0 1 216 148" fill="none" stroke="url(#goldHighlight)" stroke-width="6" stroke-linecap="round"/>
    <path d="M 338 180 A 58 58 0 0 0 296 148" fill="none" stroke="url(#goldHighlight)" stroke-width="6" stroke-linecap="round"/>
    
    <!-- Heart in Center -->
    <path d="M 256 232 C 256 232, 235 208, 235 194 C 235 183, 245 177, 256 189 C 267 177, 277 183, 277 194 C 277 208, 256 232, 256 232 Z" fill="url(#goldGrad)"/>
    <!-- Diamond Accent -->
    <polygon points="328,154 338,142 348,154 338,166" fill="url(#goldHighlight)"/>
  </g>

  <!-- Charity Hands (Supporting & Uplifting in Pure White) -->
  <g fill="#FFFFFF" opacity="0.95">
    <!-- Left Hand -->
    <path d="M 112 216 C 112 198, 130 198, 132 216 C 137 252, 158 310, 194 352 C 218 380, 248 400, 256 406 C 248 418, 234 420, 218 412 C 142 376, 95 304, 86 244 C 84 226, 112 216, 112 216 Z"/>
    <path d="M 140 204 C 140 190, 156 190, 158 206 C 163 240, 182 288, 214 328 C 202 310, 188 274, 182 238 C 180 224, 160 224, 158 238 C 154 268, 166 304, 182 334 C 158 298, 144 250, 140 204 Z"/>

    <!-- Right Hand -->
    <path d="M 400 216 C 400 198, 382 198, 380 216 C 375 252, 354 310, 318 352 C 294 380, 264 400, 256 406 C 264 418, 278 420, 294 412 C 370 376, 417 304, 426 244 C 428 226, 400 216, 400 216 Z"/>
    <path d="M 372 204 C 372 190, 356 190, 354 206 C 349 240, 330 288, 298 328 C 310 310, 324 274, 330 238 C 332 224, 352 224, 354 238 C 358 268, 346 304, 330 334 C 354 298, 368 250, 372 204 Z"/>
  </g>
</svg>`;

// 2. Standalone Emblem SVG (Transparent background)
const emblemMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="78 44 356 376" width="100%" height="100%">
  <defs>
    <linearGradient id="embGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <linearGradient id="embGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7"/>
      <stop offset="25%" stop-color="#FBBF24"/>
      <stop offset="65%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <linearGradient id="embGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FDE68A"/>
    </linearGradient>
    <filter id="embGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Top Stars / Sparkles -->
  <g fill="url(#embGold)" filter="url(#embGlow)">
    <path d="M 256 50 Q 256 80 236 88 Q 256 96 256 126 Q 256 96 276 88 Q 256 80 256 50 Z"/>
    <path d="M 205 80 Q 205 95 194 100 Q 205 105 205 120 Q 205 105 216 100 Q 205 95 205 80 Z" opacity="0.85"/>
    <path d="M 307 80 Q 307 95 296 100 Q 307 105 307 120 Q 307 105 318 100 Q 307 95 307 80 Z" opacity="0.85"/>
  </g>

  <!-- Interlocking Wedding Rings -->
  <g id="rings">
    <ellipse cx="214" cy="195" rx="60" ry="60" fill="none" stroke="url(#embGold)" stroke-width="19" stroke-linecap="round"/>
    <ellipse cx="298" cy="195" rx="60" ry="60" fill="none" stroke="url(#embGold)" stroke-width="19" stroke-linecap="round"/>
    <path d="M 172 170 A 60 60 0 0 1 214 135" fill="none" stroke="url(#embGoldLight)" stroke-width="6" stroke-linecap="round"/>
    <path d="M 340 170 A 60 60 0 0 0 298 135" fill="none" stroke="url(#embGoldLight)" stroke-width="6" stroke-linecap="round"/>
    
    <!-- Heart Motif -->
    <path d="M 256 222 C 256 222, 235 200, 235 186 C 235 176, 244 170, 256 182 C 268 170, 277 176, 277 186 C 277 200, 256 222, 256 222 Z" fill="url(#embGold)"/>
    <polygon points="332,145 344,133 356,145 344,157" fill="url(#embGoldLight)"/>
  </g>

  <!-- Caring Charity Hands in Emerald Green -->
  <g fill="url(#embGreen)">
    <!-- Left Hand -->
    <path d="M 102 210 C 102 192, 120 192, 122 210 C 127 245, 148 302, 184 344 C 208 372, 240 392, 256 400 C 248 412, 234 414, 218 406 C 142 370, 95 298, 86 238 C 84 220, 102 210, 102 210 Z"/>
    <path d="M 130 198 C 130 184, 146 184, 148 200 C 153 234, 172 282, 204 322 C 192 304, 178 268, 172 232 C 170 218, 150 218, 148 232 C 144 262, 156 298, 172 328 C 148 292, 134 244, 130 198 Z"/>
    
    <!-- Right Hand -->
    <path d="M 410 210 C 410 192, 392 192, 390 210 C 385 245, 364 302, 328 344 C 304 372, 272 392, 256 400 C 264 412, 278 414, 294 406 C 370 370, 417 298, 426 238 C 428 220, 410 210, 410 210 Z"/>
    <path d="M 382 198 C 382 184, 366 184, 364 200 C 359 234, 340 282, 308 322 C 320 304, 334 268, 340 232 C 342 218, 362 218, 364 232 C 368 262, 356 298, 340 328 C 364 292, 378 244, 382 198 Z"/>
  </g>
</svg>`;

// 3. Full Brand Logo (Horizontal Navbar format: 540x120)
const horizontalLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 120" width="540" height="120">
  <defs>
    <linearGradient id="hGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <linearGradient id="hGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7"/>
      <stop offset="25%" stop-color="#FBBF24"/>
      <stop offset="65%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <linearGradient id="hGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FDE68A"/>
    </linearGradient>
  </defs>

  <!-- Left Emblem (Scaled & Centered in 120x120 area) -->
  <g transform="translate(10, 8) scale(0.20)">
    <!-- Top Sparkle -->
    <path d="M 256 30 Q 256 65 230 75 Q 256 85 256 120 Q 256 85 282 75 Q 256 65 256 30 Z" fill="url(#hGold)"/>
    <path d="M 195 65 Q 195 82 182 88 Q 195 94 195 110 Q 195 94 208 88 Q 195 82 195 65 Z" fill="url(#hGold)" opacity="0.8"/>
    <path d="M 317 65 Q 317 82 304 88 Q 317 94 317 110 Q 317 94 330 88 Q 317 82 317 65 Z" fill="url(#hGold)" opacity="0.8"/>

    <!-- Rings -->
    <ellipse cx="205" cy="205" rx="68" ry="68" fill="none" stroke="url(#hGold)" stroke-width="20" stroke-linecap="round"/>
    <ellipse cx="307" cy="205" rx="68" ry="68" fill="none" stroke="url(#hGold)" stroke-width="20" stroke-linecap="round"/>
    <path d="M 158 175 A 68 68 0 0 1 205 137" fill="none" stroke="url(#hGoldLight)" stroke-width="7" stroke-linecap="round"/>
    <path d="M 354 175 A 68 68 0 0 0 307 137" fill="none" stroke="url(#hGoldLight)" stroke-width="7" stroke-linecap="round"/>
    <!-- Heart in Center -->
    <path d="M 256 235 C 256 235, 230 210, 230 194 C 230 182, 241 176, 256 190 C 271 176, 282 182, 282 194 C 282 210, 256 235, 256 235 Z" fill="url(#hGold)"/>

    <!-- Hands -->
    <g fill="url(#hGreen)">
      <path d="M 85 220 C 85 198, 106 198, 108 220 C 114 260, 138 325, 180 372 C 208 404, 244 426, 256 432 C 246 448, 230 450, 212 440 C 126 398, 74 318, 65 250 C 62 230, 85 220, 85 220 Z"/>
      <path d="M 118 206 C 118 190, 136 190, 138 208 C 144 246, 165 300, 201 346 C 187 326, 172 286, 164 246 C 162 230, 140 230, 138 246 C 133 280, 147 320, 165 352 C 138 312, 122 258, 118 206 Z"/>
      <path d="M 427 220 C 427 198, 406 198, 404 220 C 398 260, 374 325, 332 372 C 304 404, 268 426, 256 432 C 266 448, 282 450, 300 440 C 386 398, 438 318, 447 250 C 450 230, 427 220, 427 220 Z"/>
      <path d="M 394 206 C 394 190, 376 190, 374 208 C 368 246, 347 300, 311 346 C 325 326, 340 286, 348 246 C 350 230, 372 230, 374 246 C 379 280, 365 320, 347 352 C 374 312, 390 258, 394 206 Z"/>
    </g>
  </g>

  <!-- Typography -->
  <g font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <!-- Main Title -->
    <text x="126" y="58" font-size="33" font-weight="800" fill="#064E3B" letter-spacing="-0.5px">
      Marry<tspan fill="#D97706">With</tspan>Dignity
    </text>
    
    <!-- Subtitle / Tagline -->
    <text x="128" y="86" font-size="12.5" font-weight="700" fill="#047857" letter-spacing="3.5px">
      MARRIAGE ASSISTANCE CHARITY
    </text>

    <!-- Accent Line -->
    <rect x="128" y="98" width="395" height="2" rx="1" fill="url(#hGold)" opacity="0.35"/>
  </g>
</svg>`;

// 4. Social OpenGraph / Twitter Banner (1200x630)
const ogBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022c22"/>
      <stop offset="50%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#065f46"/>
    </linearGradient>
    <linearGradient id="ogGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7"/>
      <stop offset="30%" stop-color="#FBBF24"/>
      <stop offset="70%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)"/>
  <rect width="1160" height="590" x="20" y="20" rx="30" fill="none" stroke="url(#ogGold)" stroke-width="2" opacity="0.3"/>

  <!-- Center Emblem -->
  <g transform="translate(600, 210) translate(-90, -90) scale(0.35)">
    <!-- Top Sparkles -->
    <path d="M 256 50 Q 256 80 236 88 Q 256 96 256 126 Q 256 96 276 88 Q 256 80 256 50 Z" fill="url(#ogGold)"/>
    <path d="M 205 80 Q 205 95 194 100 Q 205 105 205 120 Q 205 105 216 100 Q 205 95 205 80 Z" fill="url(#ogGold)" opacity="0.85"/>
    <path d="M 307 80 Q 307 95 296 100 Q 307 105 307 120 Q 307 105 318 100 Q 307 95 307 80 Z" fill="url(#ogGold)" opacity="0.85"/>

    <!-- Rings -->
    <ellipse cx="214" cy="195" rx="60" ry="60" fill="none" stroke="url(#ogGold)" stroke-width="19" stroke-linecap="round"/>
    <ellipse cx="298" cy="195" rx="60" ry="60" fill="none" stroke="url(#ogGold)" stroke-width="19" stroke-linecap="round"/>
    <!-- Heart -->
    <path d="M 256 222 C 256 222, 235 200, 235 186 C 235 176, 244 170, 256 182 C 268 170, 277 176, 277 186 C 277 200, 256 222, 256 222 Z" fill="url(#ogGold)"/>

    <!-- Hands -->
    <g fill="#FFFFFF">
      <path d="M 102 210 C 102 192, 120 192, 122 210 C 127 245, 148 302, 184 344 C 208 372, 240 392, 256 400 C 248 412, 234 414, 218 406 C 142 370, 95 298, 86 238 C 84 220, 102 210, 102 210 Z"/>
      <path d="M 130 198 C 130 184, 146 184, 148 200 C 153 234, 172 282, 204 322 C 192 304, 178 268, 172 232 C 170 218, 150 218, 148 232 C 144 262, 156 298, 172 328 C 148 292, 134 244, 130 198 Z"/>
      <path d="M 410 210 C 410 192, 392 192, 390 210 C 385 245, 364 302, 328 344 C 304 372, 272 392, 256 400 C 264 412, 278 414, 294 406 C 370 370, 417 298, 426 238 C 428 220, 410 210, 410 210 Z"/>
      <path d="M 382 198 C 382 184, 366 184, 364 200 C 359 234, 340 282, 308 322 C 320 304, 334 268, 340 232 C 342 218, 362 218, 364 232 C 368 262, 356 298, 340 328 C 364 292, 378 244, 382 198 Z"/>
    </g>
  </g>

  <!-- Typography -->
  <g text-anchor="middle" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <text x="600" y="380" font-size="58" font-weight="800" fill="#FFFFFF" letter-spacing="-1px">
      Marry<tspan fill="#FBBF24">With</tspan>Dignity
    </text>
    <text x="600" y="430" font-size="20" font-weight="700" fill="#A7F3D0" letter-spacing="6px">
      SPONSOR A BRIDE • 100% ZAKAT &amp; SADAQAH
    </text>
    <text x="600" y="480" font-size="16" font-weight="500" fill="#E2E8F0" letter-spacing="1px" opacity="0.9">
      Transparent Marriage Assistance for Impoverished &amp; Orphan Daughters in Pakistan
    </text>
  </g>
</svg>`;

async function main() {
  const rootDir = path.resolve(__dirname);
  const imagesDir = path.join(rootDir, 'images');

  // 1. Write SVG files
  fs.writeFileSync(path.join(rootDir, 'favicon.svg'), faviconSvg.trim());
  fs.writeFileSync(path.join(imagesDir, 'favicon.svg'), faviconSvg.trim());
  fs.writeFileSync(path.join(imagesDir, 'logo-icon.svg'), emblemMarkSvg.trim());
  fs.writeFileSync(path.join(imagesDir, 'logo.svg'), horizontalLogoSvg.trim());
  fs.writeFileSync(path.join(imagesDir, 'logo-full.svg'), horizontalLogoSvg.trim());
  fs.writeFileSync(path.join(imagesDir, 'og-image.svg'), ogBannerSvg.trim());

  // 2. Generate PNG files
  // Favicons
  await sharp(Buffer.from(faviconSvg)).resize(16, 16).png().toFile(path.join(rootDir, 'favicon-16x16.png'));
  await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toFile(path.join(rootDir, 'favicon-32x32.png'));
  await sharp(Buffer.from(faviconSvg)).resize(48, 48).png().toFile(path.join(rootDir, 'favicon-48x48.png'));
  await sharp(Buffer.from(faviconSvg)).resize(180, 180).png().toFile(path.join(rootDir, 'apple-touch-icon.png'));
  await sharp(Buffer.from(faviconSvg)).resize(192, 192).png().toFile(path.join(rootDir, 'android-chrome-192x192.png'));
  await sharp(Buffer.from(faviconSvg)).resize(512, 512).png().toFile(path.join(rootDir, 'android-chrome-512x512.png'));

  // Copies in images/
  await sharp(Buffer.from(faviconSvg)).resize(16, 16).png().toFile(path.join(imagesDir, 'favicon-16x16.png'));
  await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toFile(path.join(imagesDir, 'favicon-32x32.png'));
  await sharp(Buffer.from(faviconSvg)).resize(180, 180).png().toFile(path.join(imagesDir, 'apple-touch-icon.png'));
  await sharp(Buffer.from(faviconSvg)).resize(128, 128).png().toFile(path.join(imagesDir, 'favicon.png'));

  // Emblem mark (512x512 transparent PNG)
  await sharp(Buffer.from(emblemMarkSvg)).resize(512, 512).png().toFile(path.join(imagesDir, 'logo-icon.png'));

  // Main logo.png (The emblem mark for crisp icon display in navbar)
  await sharp(Buffer.from(emblemMarkSvg)).resize(256, 256).png().toFile(path.join(imagesDir, 'logo.png'));
  await sharp(Buffer.from(emblemMarkSvg)).resize(256, 256).png().toFile(path.join(rootDir, 'logo.png'));

  // Full Horizontal logo
  await sharp(Buffer.from(horizontalLogoSvg)).resize(1080, 240).png().toFile(path.join(imagesDir, 'logo-full.png'));

  // OG Social Card (1200x630)
  await sharp(Buffer.from(ogBannerSvg)).resize(1200, 630).png().toFile(path.join(imagesDir, 'og-image.png'));
  await sharp(Buffer.from(ogBannerSvg)).resize(1200, 630).png().toFile(path.join(rootDir, 'og-image.png'));

  // 3. Multi-layer ICO creation
  const b16 = await sharp(Buffer.from(faviconSvg)).resize(16, 16).png().toBuffer();
  const b32 = await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toBuffer();
  const b48 = await sharp(Buffer.from(faviconSvg)).resize(48, 48).png().toBuffer();

  function createIco(pngBuffers) {
    const numImages = pngBuffers.length;
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(numImages, 4);

    let offset = 6 + 16 * numImages;
    const entries = [];
    const sizes = [16, 32, 48];

    for (let i = 0; i < numImages; i++) {
      const buf = pngBuffers[i];
      const size = sizes[i] || 32;
      const entry = Buffer.alloc(16);
      entry.writeUInt8(size >= 256 ? 0 : size, 0);
      entry.writeUInt8(size >= 256 ? 0 : size, 1);
      entry.writeUInt8(0, 2);
      entry.writeUInt8(0, 3);
      entry.writeUInt16LE(1, 4);
      entry.writeUInt16LE(32, 6);
      entry.writeUInt32LE(buf.length, 8);
      entry.writeUInt32LE(offset, 12);

      entries.push(entry);
      offset += buf.length;
    }

    return Buffer.concat([header, ...entries, ...pngBuffers]);
  }

  const ico = createIco([b16, b32, b48]);
  fs.writeFileSync(path.join(rootDir, 'favicon.ico'), ico);
  fs.writeFileSync(path.join(imagesDir, 'favicon.ico'), ico);

  // 4. Web Manifest
  const manifest = {
    name: "MarryWithDignity",
    short_name: "MarryWithDignity",
    icons: [
      {
        src: "android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    theme_color: "#065f46",
    background_color: "#ffffff",
    display: "standalone"
  };
  fs.writeFileSync(path.join(rootDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));

  console.log('All brand assets generated perfectly!');
}

main().catch(console.error);
