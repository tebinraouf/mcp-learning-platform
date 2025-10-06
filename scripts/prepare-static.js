#!/usr/bin/env node

/**
 * Prepare static export for GitHub Pages deployment
 * 
 * This script copies the 404 page to the root of the output directory
 * to enable client-side routing on GitHub Pages. GitHub Pages serves
 * 404.html for all non-existent paths, which Next.js can then use to
 * restore the correct route.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, '..', 'out');
const NOT_FOUND_SOURCE = path.join(OUT_DIR, '404', 'index.html');
const NOT_FOUND_DEST = path.join(OUT_DIR, '404.html');

function copyNotFoundPage() {
  try {
    // Check if source file exists
    if (!fs.existsSync(NOT_FOUND_SOURCE)) {
      console.error('❌ Error: 404 source file not found at:', NOT_FOUND_SOURCE);
      console.error('   Make sure to run "next build" before this script.');
      process.exit(1);
    }

    // Check if out directory exists
    if (!fs.existsSync(OUT_DIR)) {
      console.error('❌ Error: Output directory not found at:', OUT_DIR);
      console.error('   Make sure to run "next build" before this script.');
      process.exit(1);
    }

    // Copy 404/index.html to 404.html
    fs.copyFileSync(NOT_FOUND_SOURCE, NOT_FOUND_DEST);
    
    console.log('✅ Successfully copied 404 page for GitHub Pages SPA routing');
    console.log(`   Source: ${path.relative(process.cwd(), NOT_FOUND_SOURCE)}`);
    console.log(`   Destination: ${path.relative(process.cwd(), NOT_FOUND_DEST)}`);
    
    // Verify the copy was successful
    if (!fs.existsSync(NOT_FOUND_DEST)) {
      console.error('❌ Error: Failed to create 404.html at destination');
      process.exit(1);
    }
    
    const sourceSize = fs.statSync(NOT_FOUND_SOURCE).size;
    const destSize = fs.statSync(NOT_FOUND_DEST).size;
    
    if (sourceSize !== destSize) {
      console.error('❌ Error: File size mismatch after copy');
      console.error(`   Source size: ${sourceSize} bytes`);
      console.error(`   Destination size: ${destSize} bytes`);
      process.exit(1);
    }
    
    console.log(`   File size: ${destSize} bytes`);
    console.log('');
    console.log('✨ Static export prepared for GitHub Pages deployment');
    
  } catch (error) {
    console.error('❌ Error preparing static export:', error.message);
    process.exit(1);
  }
}

// Execute
copyNotFoundPage();
