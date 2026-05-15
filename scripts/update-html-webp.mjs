import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'index.html',
  'labs.html',
  'public/case-studies/connectme.html',
  'src/styles/sections.css'
];

for (const file of filesToUpdate) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all /src/assets/.*\.png|jpg|jpeg with .webp
    content = content.replace(/(\/src\/assets\/[a-zA-Z0-9_/\s-]+)\.(png|jpg|jpeg)/gi, '$1.webp');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated references in ${file}`);
  }
}
