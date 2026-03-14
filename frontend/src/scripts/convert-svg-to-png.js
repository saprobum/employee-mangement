import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgPath = join(__dirname, '..', 'assets', 'employee-management-hero.svg');
const pngPath = join(__dirname, '..', 'assets', 'employee-management-hero.png');

async function convertSvgToPng() {
  try {
    console.log('Converting SVG to PNG...');
    
    // Read the SVG file
    const svgBuffer = readFileSync(svgPath);
    
    // Convert to PNG with sharp
    await sharp(svgBuffer)
      .resize(1200, 800) // Ensure exact dimensions
      .png({
        compressionLevel: 6,
        palette: false // Keep full color
      })
      .toFile(pngPath);
    
    console.log(`✓ Successfully converted to PNG!`);
    console.log(`  Input:  ${svgPath}`);
    console.log(`  Output: ${pngPath}`);
    console.log(`  Size: 1200x800 pixels`);
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    process.exit(1);
  }
}

convertSvgToPng();
