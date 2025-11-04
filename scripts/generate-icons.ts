import * as fs from 'fs';
import * as path from 'path';

interface IconConfig {
  source: string;
  destinations: { path: string; size: string }[];
}

// Configuration for PWA icons
const config: IconConfig = {
  source: path.join(__dirname, '..', 'public', 'lite-logo.png'),
  destinations: [
    { path: path.join(__dirname, '..', 'public', 'icon-192.png'), size: '192x192' },
    { path: path.join(__dirname, '..', 'public', 'icon-512.png'), size: '512x512' }
  ]
};

/**
 * Generates PWA icons by copying the source logo to required sizes
 */
function generatePWAIcons(): void {
  try {
    // Check if source logo exists
    if (!fs.existsSync(config.source)) {
      console.error('Source logo not found. Please add proper icon files to public directory.');
      console.log('You need to create:');
      config.destinations.forEach((dest, index) => {
        console.log(`${index + 1}. ${dest.path} (${dest.size} pixels)`);
      });
      process.exit(1);
    }

    // Copy the logo for each required size
    config.destinations.forEach(dest => {
      fs.copyFileSync(config.source, dest.path);
      console.log(`Created PWA icon: ${dest.path} (${dest.size})`);
    });

    console.log('All PWA icons created successfully!');
  } catch (error) {
    console.error('Error generating PWA icons:', error);
    process.exit(1);
  }
}

// Run the script
generatePWAIcons();