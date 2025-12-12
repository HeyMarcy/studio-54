/**
 * Fetch images from Cloudinary and generate images.json
 * 
 * Run with: node scripts/fetch-images.js
 * 
 * Requires: npm install cloudinary dotenv
 */

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = process.env.CLOUDINARY_FOLDER || 'studio-54';

async function fetchImages() {
  try {
    console.log(`Fetching images from folder: ${FOLDER}...`);
    
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: FOLDER,
      max_results: 500,
      resource_type: 'image',
    });

    const images = result.resources.map((resource, index) => {
      // Extract filename without folder prefix
      const publicId = resource.public_id;
      const filename = publicId.replace(`${FOLDER}/`, '');
      
      return {
        id: filename,
        publicId: publicId,
        alt: formatAltText(filename),
        width: resource.width,
        height: resource.height,
        format: resource.format,
        size: index < 3 ? 'half' : 'half', // Adjust layout as needed
      };
    });

    // Write to JSON file
    const outputPath = path.join(__dirname, '../dist/images.json');
    fs.writeFileSync(outputPath, JSON.stringify(images, null, 2));
    
    console.log(`✓ Generated ${outputPath}`);
    console.log(`  Found ${images.length} images`);
    
  } catch (error) {
    console.error('Error fetching images:', error.message);
    process.exit(1);
  }
}

// Convert filename to readable alt text
function formatAltText(filename) {
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\.[^.]+$/, '') // Remove extension
    .replace(/\b\w/g, c => c.toUpperCase()); // Title case
}

fetchImages();
