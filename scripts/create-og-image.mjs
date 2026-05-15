import sharp from 'sharp';

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#06060A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0C0C12;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00D4FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00FF94;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  
  <!-- Grid pattern -->
  <g opacity="0.1">
    ${Array.from({length: 20}, (_, i) => 
      `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${height}" stroke="#00D4FF" stroke-width="0.5"/>`
    ).join('')}
    ${Array.from({length: 12}, (_, i) => 
      `<line x1="0" y1="${i * 55}" x2="${width}" y2="${i * 55}" stroke="#00D4FF" stroke-width="0.5"/>`
    ).join('')}
  </g>
  
  <!-- GenSync Logo Text -->
  <text x="80" y="220" font-family="Arial, sans-serif" font-size="72" font-weight="800" fill="url(#accent)">GenSync</text>
  <text x="460" y="220" font-family="Arial, sans-serif" font-size="72" font-weight="300" fill="#F5F5F7">Media</text>
  <text x="580" y="220" font-family="Arial, sans-serif" font-size="72" font-weight="800" fill="#F5F5F7">+</text>
  
  <!-- Tagline -->
  <text x="80" y="300" font-family="Arial, sans-serif" font-size="36" fill="#A1A1A6">Media • Tech • Products • Films</text>
  
  <!-- Main Positioning -->
  <text x="80" y="400" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="#F5F5F7">Startup Marketing</text>
  <text x="540" y="400" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="url(#accent)">Agency</text>
  
  <!-- Subtext -->
  <text x="80" y="470" font-family="Arial, sans-serif" font-size="24" fill="#A1A1A6">for founders who build crazy products</text>
  
  <!-- Services -->
  <rect x="80" y="500" width="120" height="2" fill="url(#accent)"/>
  <text x="220" y="515" font-family="Arial, sans-serif" font-size="18" fill="#A1A1A6">Web • Films • Brand • AI • SaaS</text>
  
  <!-- Website -->
  <text x="900" y="580" font-family="Arial, sans-serif" font-size="24" fill="#00D4FF">www.gensync.in</text>
</svg>
`;

await sharp(Buffer.from(svg))
  .webp({ quality: 90 })
  .toFile('./public/og-image.webp');

console.log('OG Image created successfully!');