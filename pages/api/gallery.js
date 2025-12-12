/**
 * Next.js API Route: /api/gallery
 * ================================
 * 
 * If you're using Next.js, place this file at:
 * pages/api/gallery.js (Pages Router)
 * -- or --
 * app/api/gallery/route.js (App Router - see alternative below)
 * 
 * This fetches images from Cloudinary on each request.
 * For better performance, consider caching the response.
 */

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = process.env.CLOUDINARY_FOLDER || 'studio-54';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: FOLDER,
      max_results: 500,
      resource_type: 'image',
    });

    const images = result.resources.map((resource) => {
      const filename = resource.public_id.replace(`${FOLDER}/`, '');
      
      return {
        id: filename,
        publicId: resource.public_id,
        alt: formatAltText(filename),
        width: resource.width,
        height: resource.height,
        format: resource.format,
      };
    });

    // Cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(images);
    
  } catch (error) {
    console.error('Cloudinary error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
}

function formatAltText(filename) {
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\.[^.]+$/, '')
    .replace(/\b\w/g, c => c.toUpperCase());
}


/**
 * ============================================
 * APP ROUTER VERSION (Next.js 13+)
 * ============================================
 * 
 * If using App Router, create this file at:
 * app/api/gallery/route.js
 * 
 * And use this code instead:
 * 
 * import { v2 as cloudinary } from 'cloudinary';
 * import { NextResponse } from 'next/server';
 * 
 * cloudinary.config({
 *   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
 *   api_key: process.env.CLOUDINARY_API_KEY,
 *   api_secret: process.env.CLOUDINARY_API_SECRET,
 * });
 * 
 * const FOLDER = process.env.CLOUDINARY_FOLDER || 'studio-54';
 * 
 * export async function GET() {
 *   try {
 *     const result = await cloudinary.api.resources({
 *       type: 'upload',
 *       prefix: FOLDER,
 *       max_results: 500,
 *       resource_type: 'image',
 *     });
 * 
 *     const images = result.resources.map((resource) => ({
 *       id: resource.public_id.replace(`${FOLDER}/`, ''),
 *       publicId: resource.public_id,
 *       alt: resource.public_id.replace(`${FOLDER}/`, '').replace(/[-_]/g, ' '),
 *       width: resource.width,
 *       height: resource.height,
 *       format: resource.format,
 *     }));
 * 
 *     return NextResponse.json(images, {
 *       headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate' }
 *     });
 *   } catch (error) {
 *     return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
 *   }
 * }
 */
