import fs from 'fs';
import path from 'path';

const indexPath = path.join(process.cwd(), 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const replacements = [
  {
    old: "Energy infrastructure platform for smart metering and billing connectivity.",
    new: "End-to-end platform overhaul for smart metering and enterprise billing connectivity."
  },
  {
    old: "High-fidelity corporate web presence designed for credibility and conversions.",
    new: "High-conversion corporate web presence engineered for institutional credibility."
  },
  {
    old: "Community-first gaming platform built around engagement and retention.",
    new: "Social-native gaming platform optimized for community scale and user retention."
  },
  {
    old: "Launch film for an AI-powered detection platform. Script, shoot, and post.",
    new: "High-stakes launch film for an AI threat detection platform. Concept to final render."
  },
  {
    old: "Product commercial showcasing AI-powered billing intelligence.",
    new: "High-end product commercial demonstrating enterprise AI in billing intelligence."
  },
  {
    old: "3D animated product teaser for a next-gen hardware launch.",
    new: "Cinematic 3D product teaser engineered for a stealth-mode hardware launch."
  },
  {
    old: "Real-world use-case walkthrough for enterprise AI adoption.",
    new: "Tactical use-case breakdown driving enterprise AI adoption and B2B sales pipelines."
  },
  {
    old: "High-energy aftermovie capturing the spirit of a major cultural festival.",
    new: "High-octane aftermovie capturing the raw energy of a flagship cultural festival."
  },
  {
    old: "Explainer video breaking down a complex product into 60 seconds of clarity.",
    new: "Distilling complex technical products into 60 seconds of absolute, undeniable clarity."
  },
  {
    old: "Street-style interview series that crossed 2 Million+ views organically.",
    new: "High-retention street interview format that dominated algorithms and hit 2M+ organic views."
  },
  {
    old: "Fast-paced challenge format designed for maximum shareability.",
    new: "Hyper-paced challenge format engineered purely for algorithmic momentum and shareability."
  },
  {
    old: "Long-form podcast edited for retention, pacing, and visual storytelling.",
    new: "Long-form podcast edits ruthlessly optimized for average watch time and narrative pacing."
  },
  {
    old: "Full cinematic edit with color grading and sound design.",
    new: "Premium cinematic edit layered with custom sound design and broadcast-grade color grading."
  },
  {
    old: "Multi-camera concert film capturing live atmosphere and energy.",
    new: "Multi-camera concert film capturing the raw, live atmosphere and massive crowd energy."
  },
  {
    old: "Complete identity system — logo, typography, colors, and usage guidelines.",
    new: "Comprehensive brand operating system — logotypes, typography matrices, and color logic."
  },
  {
    old: "Brand strategy and visual identity for a stealth-mode hardware startup.",
    new: "Surgical brand strategy and complete visual identity architecture for stealth hardware."
  },
  {
    old: "Our 2025 reel — the best of what we shipped this year.",
    new: "Our definitive 2025 reel — a fast-paced curation of our absolute highest-impact work."
  }
];

let updatedCount = 0;
for (const rep of replacements) {
  if (content.includes(rep.old)) {
    content = content.replace(rep.old, rep.new);
    updatedCount++;
  } else {
    console.log("Could not find:", rep.old);
  }
}

fs.writeFileSync(indexPath, content, 'utf8');
console.log(`Updated ${updatedCount} descriptions in index.html`);
