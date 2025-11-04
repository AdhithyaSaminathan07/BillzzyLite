const fs = require('fs');
const path = require('path');

// Create a simple script to copy and rename existing logo as PWA icons
const sourceLogo = path.join(__dirname, '..', 'public', 'lite-logo.png');
const dest192 = path.join(__dirname, '..', 'public', 'icon-192.png');
const dest512 = path.join(__dirname, '..', 'public', 'icon-512.png');

// Check if source logo exists
if (fs.existsSync(sourceLogo)) {
  // Copy the same logo for both sizes (this is just for demonstration)
  // In a real app, you would want properly sized icons
  fs.copyFileSync(sourceLogo, dest192);
  fs.copyFileSync(sourceLogo, dest512);
  console.log('PWA icons created successfully!');
} else {
  console.log('Source logo not found. Please add proper icon files to public directory.');
  console.log('You need to create:');
  console.log('1. public/icon-192.png (192x192 pixels)');
  console.log('2. public/icon-512.png (512x512 pixels)');
}