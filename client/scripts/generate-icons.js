import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes for PWA
const iconSizes = [
  16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 310, 384, 512
];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Source logo path
const sourceLogo = path.join(__dirname, '../public/imgs/VideoCrewLogo.webp');

async function generateIcons() {
  try {
    console.log('🔄 Generating PWA icons...');

    // Check if source logo exists
    if (!fs.existsSync(sourceLogo)) {
      console.error('❌ Source logo not found:', sourceLogo);
      return;
    }

    // Generate icons for each size
    for (const size of iconSizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(sourceLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated icon-${size}x${size}.png`);
    }

    // Generate maskable icons (with padding for Android)
    const maskableSizes = [192, 512];
    for (const size of maskableSizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}-maskable.png`);
      
      // Create maskable icon with safe area
      const safeArea = Math.round(size * 0.1); // 10% safe area
      const iconSize = size - (safeArea * 2);
      
      await sharp(sourceLogo)
        .resize(iconSize, iconSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .extend({
          top: safeArea,
          bottom: safeArea,
          left: safeArea,
          right: safeArea,
          background: { r: 0, g: 0, b: 0, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated maskable icon-${size}x${size}.png`);
    }

    // Generate Safari pinned tab SVG
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <mask id="mask">
      <rect width="16" height="16" fill="white"/>
      <circle cx="8" cy="8" r="6" fill="black"/>
    </mask>
  </defs>
  <rect width="16" height="16" fill="#000000" mask="url(#mask)"/>
</svg>`;

    fs.writeFileSync(path.join(iconsDir, 'safari-pinned-tab.svg'), svgContent);
    console.log('✅ Generated safari-pinned-tab.svg');

    console.log('🎉 All PWA icons generated successfully!');
    console.log('📁 Icons saved to:', iconsDir);

  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

// Run the script
generateIcons();
